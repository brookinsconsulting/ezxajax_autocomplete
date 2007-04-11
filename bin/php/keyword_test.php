#!/usr/bin/env php
<?php

include_once( 'kernel/classes/ezscript.php' );
include_once( 'lib/ezutils/classes/ezcli.php' );

$cli =& eZCLI::instance();

$scriptSettings = array();
$scriptSettings['description'] = 'Retrieve keywords based on a start value';
$scriptSettings['use-session'] = true;
$scriptSettings['use-modules'] = true;
$scriptSettings['use-extensions'] = true;

$script =& eZScript::instance( $scriptSettings );
$script->startup();
$config = '';

$argumentConfig = '[alphabeta]';
$optionHelp = false;
$arguments = false;


$useStandardOptions = array( 'user' => true );

$options = $script->getOptions( $config, $argumentConfig, $optionHelp, $arguments, $useStandardOptions );
$script->initialize();

if ( count( $options['arguments'] ) != 1 )
{
    $script->shutdown( 1, 'wrong argument count' );
}

$alphabet = $options['arguments'][0];
include_once( 'kernel/classes/datatypes/ezuser/ezuser.php' );
include_once( 'lib/ezutils/classes/ezfunctionhandler.php' );

$searchParamArray=array(
    'alphabet' => $alphabet,
    'limit'  => 30,
    /*'classid' => $classID,*/
    'sort_by' => array( 'keyword', true )
);

$results = eZFunctionHandler::execute( 'content', 'keyword', $searchParamArray );

print_r( $results );

$script->shutdown( 0 );

?>