<?php

function keywordSuggest( $term, $textBoxID, $typeAhead, $classID = null )
{
    $resp = new xajaxResponse();
    include_once( 'lib/ezutils/classes/ezfunctionhandler.php' );

    $searchParamArray=array(
        'alphabet' => $term,
        'limit'  => 30,
        'classid' => $classID,
        'sort_by' => array( 'keyword', true )
    );

    $results = eZFunctionHandler::execute( 'content', 'keyword', $searchParamArray );

    $words = array();
    foreach ( $results as $result )
    {
        if ( trim( $result['keyword'] ) != '' )
        {
            $words[] = $result['keyword'];
        }
    }

    $resp->addScriptCall( 'autoSuggest', $textBoxID, $words, $typeAhead );
    return $resp->getXML();
}

?>