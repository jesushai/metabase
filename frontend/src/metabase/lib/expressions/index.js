
import _ from "underscore";
import { mbqlEq } from "../query/util";

import { VALID_OPERATORS, VALID_AGGREGATIONS } from "./tokens";

export { VALID_OPERATORS, VALID_AGGREGATIONS } from "./tokens";

const RESERVED_WORDS = new Set(VALID_AGGREGATIONS.values());

export function formatAggregationName(aggregationOption) {
    return VALID_AGGREGATIONS.get(aggregationOption.short);
}

function formatIdentifier(name) {
    return /^\w+$/.test(name) && !RESERVED_WORDS.has(name) ?
        name :
        JSON.stringify(name);
}

export function formatMetricName(metric) {
    return formatIdentifier(metric.name);
}

export function formatFieldName(field) {
    return formatIdentifier(field.display_name);
}

export function formatExpressionName(name) {
    return formatIdentifier(name);
}

// move to query lib

export function isExpression(expr) {
    return isMath(expr) || isAggregation(expr) || isField(expr) || isMetric(expr) || isExpressionReference(expr);
}

export function isField(expr) {
    return Array.isArray(expr) && expr.length === 2 && mbqlEq(expr[0], 'field-id') && typeof expr[1] === 'number';
}

export function isMetric(expr) {
    // case sensitive, unlike most mbql
    return Array.isArray(expr) && expr.length === 2 && expr[0] === "METRIC" && typeof expr[1] === 'number';
}

export function isMath(expr) {
    return Array.isArray(expr) && VALID_OPERATORS.has(expr[0]) && _.all(expr.slice(1), isValidArg);
}

export function isAggregation(expr) {
    return Array.isArray(expr) && VALID_AGGREGATIONS.has(expr[0]) && _.all(expr.slice(1), isValidArg);
}

export function isExpressionReference(expr) {
    return Array.isArray(expr) && expr.length === 2 && mbqlEq(expr[0], 'expression') && typeof expr[1] === 'string';
}

export function isValidArg(arg) {
    return isExpression(arg) || isField(arg) || typeof arg === 'number';
}
