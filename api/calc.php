<?php
/**
 * Created by PhpStorm.
 * User: Timofeev Vlad
 * Date: 12.01.2019
 * Time: 11:44
 */




const PERCENT = 10;

/**
 * Функция устанавливает код состояния HTTP,
 * и выводит информацию об ошибке в json формате
 * @param $codeError
 * @param array $info
 */
function responseError($codeError, $info=null){
    $errorList = [
        400 => "Bad Request",
        405 => "Method Not Allowed"
    ];
    header('HTTP/1.0 '.$codeError.' '.$errorList[$codeError]);
    if ($info){
        echo json_encode(["error"=>$info]);
    }

    exit;
}


/**
 * Функция отправляет ответ в json формате
 * @param $data
 */
function responseJson($data){
    header('HTTP/1.0 200 OK');
    echo json_encode(["response"=>$data]);
    exit;
}
/**
 * Возвращает объект json
 * @return mixed
 */
function getRequestJson(){
    $json_str = file_get_contents('php://input');
    $json_arr = json_decode($json_str,true);
    if(!is_array($json_arr)){
        responseError(400);
    }

    return $json_arr;
}


/**
 * Функция проверяет входной параметр на целое число и возращает int,
 * или null если параметр не является числовым
 * @param $number
 * @return int|null
 */
function cleanInt($number){
    if (ctype_digit(trim($number))){
        return intval($number);
    }
    return null;
}


if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0){
    responseError(405);
}

$data = getRequestJson()['data'];




$years          = $data['years'];
$addSumDeposit  = $data['addSumDeposit'];
$dataDeposit    = $data['dataDeposit'];
$sumDeposit     = $data['sumDeposit'];
$isReplenished  = $data['isReplenished'];


/* проверяем входные данные */
$errorInfo=[];

$years=cleanInt($years);
if ($years === null){
    $errorInfo["typeError"][]="years";
} else {
    if ($years < 1 || $years > 5){
        $errorInfo["outRange"][]="years";
    }
}

$addSumDeposit=cleanInt($addSumDeposit);
if ($addSumDeposit === null){
    $errorInfo["typeError"][]="addSumDeposit";
} else {
    if ($addSumDeposit < 1000 || $addSumDeposit > 3000000){
        $errorInfo["outRange"][]="addSumDeposit";
    }
}

$sumDeposit=cleanInt($sumDeposit);
if ($sumDeposit === null){
    $errorInfo["typeError"][]="sumDeposit";
} else {
    if ($sumDeposit < 1000 || $sumDeposit > 3000000){
        $errorInfo["outRange"][]="sumDeposit";
    }
}

$isReplenished=cleanInt($isReplenished);
if ($isReplenished === null){
    $errorInfo["typeError"][]="isReplenished";
}

$daysN = DateTime::createFromFormat('d.m.Y', $dataDeposit);
if (!$daysN){
    $errorInfo["typeError"][]="dataDeposit";
}

if (!empty($errorInfo)){
    responseError(400,$errorInfo);
}




$begin = new DateTime( $dataDeposit );
$end = (new DateTime($dataDeposit))->modify('+'.$years.' year');

$interval = DateInterval::createFromDateString('1 month');
$period = new DatePeriod($begin, $interval, $end);

$end->modify('-1 month');

$sum_last_month = $sumDeposit;
foreach ( $period as $dt ){
    $DaysN = $dt->format('L')?366:365;
    $pr = ($sum_last_month)*$dt->format('t')*(PERCENT/100/$DaysN);
    $pr = round($pr,2);
    $sum_last_month = $sum_last_month+$pr;

    if ($dt !=  $end && $isReplenished){
        $sum_last_month+=$addSumDeposit;
    }
}

responseJson(round($sum_last_month,0));


