const variableTypes = [
    "any",
    "boolean",
    "date",
    "datetime",
    "entity",
    "float",
    "handle",
    "image",
    "lineardate",
    "lineardatetime",
    "lineartime",
    "numeric",
    "occurrence",
    "raw",
    "string",
    "struct",
    "time",
    "xmlstream",
];
export const variableRegex = `(${variableTypes.join("|")})\\s+(\\w+)`;

export const ifInlineRegex = /^if\s*\((?![^)]*\$)([^)]+)\)\s+(.+?)(?:\s*;.*)?$/i;

const endKeywords = [
    "end",
    "endif",
    "endfor",
    "endwhile",
    "endvariables",
    "endparams",
    "until",
    "endselectcase",
    "endtry",
];
export const endKeywordsRegex = `^(${endKeywords.join("|")})(\\s+.*)?\\s*(;.*)?$`;

const startKeywords = [
    "entry",
    "trigger",
    "if",
    "operation",
    "for",
    "repeat",
    "while",
    "forentity",
    "variables",
    "params",
    "forlist",
    "forlist\\/id",
    "selectcase",
    "try",
];
export const startKeywordsRegex = `^(${startKeywords.join("|")})\\s*\\(?`; 

export const blockEndRegex = /^\s*end\b(?!if|for|while|variables|params|selectcase|try)/i;
export const blockStartRegex = /^\s*(entry|operation|trigger|function)\b/i;