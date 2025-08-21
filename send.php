<?php
header('Content-Type: application/json');

$response = ['ok' => false, 'message' => ''];

$street     = trim($_POST['street'] ?? '');
$city       = trim($_POST['city'] ?? '');
$zip        = trim($_POST['zip'] ?? '');
$email      = trim($_POST['email'] ?? '');

if (!$street || !$city || !$zip || !$email) {
  echo json_encode(['ok' => false, 'message' => 'Missing required fields']);
  exit;
}

$owner      = trim($_POST['owner'] ?? '');
$company    = trim($_POST['company'] ?? '');
$phone      = trim($_POST['phone'] ?? '');
$details    = trim($_POST['details'] ?? '');
$assessorId = trim($_POST['assessorId'] ?? '');

$bodyHtml = "
  <h2>New BPO Request</h2>
  <p><strong>Address:</strong> {$street}, {$city} NM {$zip}</p>
  <p><strong>Owner:</strong> {$owner}</p>
  <p><strong>Company:</strong> {$company}</p>
  <p><strong>Email:</strong> {$email}</p>
  <p><strong>Phone:</strong> {$phone}</p>
  <p><strong>Assessor Identifying Owner#:</strong> {$assessorId}</p>
  <p><strong>Additional Details:</strong><br>" . nl2br(htmlspecialchars($details)) . "</p>
";

$to = 'YOUR_INBOX@yourdomain.com';
$from = 'no-reply@bposnewmexico.com';
$subject = 'New BPO Intake Request';

$phpmailerPath = __DIR__ . '/vendor/PHPMailer/PHPMailer.php';
if (file_exists($phpmailerPath)) {
  try {
    require __DIR__ . '/vendor/PHPMailer/PHPMailer.php';
    require __DIR__ . '/vendor/PHPMailer/SMTP.php';
    require __DIR__ . '/vendor/PHPMailer/Exception.php';
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = 'smtp.yourmailhost.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'no-reply@bposnewmexico.com';
    $mail->Password   = 'YOUR_SMTP_PASSWORD';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom($from, 'BPOs New Mexico');
    $mail->addAddress($to, 'BPO Intake');
    $mail->addReplyTo($email ?: $from);

    $allowed = ['image/jpeg','application/pdf'];
    $total = 0;
    if (!empty($_FILES['files'])) {
      foreach ($_FILES['files']['tmp_name'] as $i => $tmp) {
        if (!is_uploaded_file($tmp)) continue;
        $type = mime_content_type($tmp);
        $size = (int) $_FILES['files']['size'][$i];
        if (!in_array($type, $allowed)) continue;
        $total += $size;
        if ($total > 10 * 1024 * 1024) break;
        $mail->addAttachment($tmp, $_FILES['files']['name'][$i]);
      }
    }

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $bodyHtml;
    $mail->AltBody = strip_tags(str_replace(['<br>','<br/>','<br />'], "\n", $bodyHtml));
    $mail->send();
    echo json_encode(['ok' => true, 'message' => 'sent via smtp']);
    exit;
  } catch (Exception $e) {
  }
}

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: BPOs New Mexico <{$from}>\r\n";
$headers .= "Reply-To: {$email}\r\n";

if (@mail($to, $subject, $bodyHtml, $headers)) {
  echo json_encode(['ok' => true, 'message' => 'sent via mail()']);
} else {
  echo json_encode(['ok' => false, 'message' => 'send failed']);
}
