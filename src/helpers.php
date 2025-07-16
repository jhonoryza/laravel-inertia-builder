<?php

if (! function_exists('extractRelation')) {
    function extractRelation(string $relation): array
    {
        $tmp               = explode('.', $relation);
        $relationAttribute = end($tmp);
        $tmp               = array_diff($tmp, [$relationAttribute]);
        $relationName      = implode('.', $tmp);

        return [$relationName, $relationAttribute];
    }
}
