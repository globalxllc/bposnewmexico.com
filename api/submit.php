<?php
header('Content-Type: application/json');
function field($k){ return isset($_POST[$k]) ? trim($_POST[$k]) : ''; }
$backOffice='backoffice@bposnewmexico.com';
$notifyEmail='globalxllc@gmail.com';
try{
  $name=field('name'); $email=field('email');
  if(!$name || !$email) throw new Exception('Missing required fields');
  $subject='New BPO Intake Submission';
  $body="Name: $name\nEmail: $email";
  $headers="From: BPO Intake <no-reply@bposnewmexico.com>\r\n";
  $ok1=@mail($backOffice,$subject,$body,$headers);
  $ok2=@mail($notifyEmail,$subject,$body,$headers);
  if(!$ok1 && !$ok2) throw new Exception('Mail failed');
  echo json_encode(['ok'=>true,'message'=>'Submitted. We’ll be in touch shortly.']);
}catch(Exception $e){
  http_response_code(400);
  echo json_encode(['ok'=>false,'error'=>$e->getMessage()]);
}