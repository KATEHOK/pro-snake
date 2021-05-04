<?php
$userRole = 'unknown';
if (isset($_SESSION['userRole'])) {
    $userRole = $_SESSION['userRole'];
} else {
    $_SESSION['userRole'] = $userRole;
}
