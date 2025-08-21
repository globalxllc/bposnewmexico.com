<?php
header('Content-Type: application/json');

function field($k){ return isset($_POST[$k]) ? trim($_POST[$k]) : ''; }

$backOffice  = 'backoffice@bposnewmexico.com'; // primary
$notifyEmail = 'globalxllc@gmail.com';         // copy

try {
  $name  = field('name');
  $email = field('email');
  $phone = field('phone');
  $addr  = field('address');
  $owner = field('assessor_owner_id');
  $notes = field('notes');

  if (!$name)  { throw new Exception('Missing name'); }
  if (!$email) { throw new Exception('Missing email'); }

  $subject = 'New BPO Intake Submission';
  $boundary = md5(uniqid(time()));

  $bodyText  = "New BPO Intake Submission\n\n";
  $bodyText .= "Name: $name\nEmail: $email\nPhone: $phone\nAddress: $addr\nAssessor Owner#: $owner\n\nNotes:\n$notes\n";

  $headers  = "From: BPO Intake <no-reply@bposnewmexico.com>\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: multipart/mixed; boundary=\"".$boundary."\"\r\n";

  $message  = "--$boundary\r\n";
  $message .= "Content-Type: text/plain; charset=\"utf-8\"\r\n";
  $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
  $message .= $bodyText . "\r\n";

  if (!empty($_FILES['uploads']) && is_array($_FILES['uploads']['tmp_name'])) {
    for ($i = 0; $i < count($_FILES['uploads']['tmp_name']); $i++) {
      if (is_uploaded_file($_FILES['uploads']['tmp_name'][$i])) {
        $file_tmp  = $_FILES['uploads']['tmp_name'][$i];
        $file_name = $_FILES['uploads']['name'][$i];
        $file_type = mime_content_type($file_tmp);
        $file_data = chunk_split(base64_encode(file_get_contents($file_tmp)));

        $message .= "--$boundary\r\n";
        $message .= "Content-Type: $file_type; name=\"$file_name\"\r\n";
        $message .= "Content-Transfer-Encoding: base64\r\n";
        $message .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n\r\n";
        $message .= $file_data . "\r\n";
      }
    }
  }

  $message .= "--$boundary--\r\n";

  $ok1 = @mail($backOffice, $subject, $message, $headers);
  $ok2 = @mail($notifyEmail, $subject, $message, $headers);

  if (!$ok1 && !$ok2) throw new Exception('Mail transfer failed on server. Configure SMTP if problem persists.');

  echo json_encode(['ok' => true, 'message' => 'Submitted. We’ll be in touch shortly.']);
} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => $e->getMessage() ]);
}
