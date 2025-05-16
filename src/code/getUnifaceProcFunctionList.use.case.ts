export interface ProcFunction {
    name: string;
    params: string[];
    docs: string;
}

export class GetUnifaceProcFunctionList {
    public execute(): ProcFunction[] {
        return [
            {
                name: "$about",
                params: [],
                docs: "Returns information about the current Uniface installation, version, and platform.",
            },
            {
                name: "$abs",
                params: ["numeric X"],
                docs: "Return the absolute value of a numeric value.",
            },
            {
                name: "$acos",
                params: ["numeric X"],
                docs: "Return the arc cosine of X (in radians). X must be between -1 and 1.",
            },
            {
                name: "$applname",
                params: [],
                docs: "Return the name of the Application Shell (in uppercase).",
            },
            {
                name: "$applproperties",
                params: ["string PropertyList"],
                docs: "Set the presentation properties of the application shell.",
            },
            {
                name: "$appltitle",
                params: [],
                docs: "Return or set the window title bar text of a Uniface Windows application. Can be used to override the value defined in GUI-specific settings.",
            },
            {
                name: "$asin",
                params: ["numeric X"],
                docs: "Return the arc sine of X (in radians). X must be between -1 and 1. Returns angle whose sine is X.",
            },
            {
                name: "$atan",
                params: ["numeric X"],
                docs: "Return the arc tangent of X (in radians). Returns angle whose tangent is X.",
            },
            {
                name: "$batch",
                params: [],
                docs: "Return the batch mode indicator (1=batch mode, 0=interactive).",
            },
            {
                name: "$bold",
                params: ["string Text"],
                docs: "Apply bold character attribute to a string. Only visible in displayed Unifield.",
            },
            {
                name: "$cellinfo",
                params: ["string InstanceName (optional)"],
                docs: "Get dimensions of a character cell in pixels (returns associative list with xsize and ysize). Returns empty in batch mode.",
            },
            {
                name: "$callup",
                params: [],
                docs: "Call the same trigger one level up in the hierarchy. Used in field/entity triggers like detail, help, or menu.",
            },
            {
                name: "$char",
                params: [],
                docs: "Return Uniface character code for the key that activated a trigger (decimal format). Only valid in Unifields.",
            },
            {
                name: "$check",
                params: [],
                docs: "Return or set checked status of a menu item (1=checked, 0=unchecked). Used in preDisplay trigger of Menu objects.",
            },
            {
                name: "$clock",
                params: ["string Source (optional)"],
                docs: "Return system time or convert argument to Time data type.",
            },
            {
                name: "$curocc",
                params: ["string Entity (optional)"],
                docs: "Return sequence number of current occurrence in hitlist.",
            },
            {
                name: "$clearselection",
                params: ["string Entity (optional)"],
                docs: "Clear the $selected attribute of all occurrences of the specified entity. Built-in entity operation.",
            },
            {
                name: "$collhandle",
                params: ["string Entity (optional)"],
                docs: "Returns the handle of the specified entity collection. Used to address multiple occurrences.",
            },
            {
                name: "$columnsyntax",
                params: ["string Field", "string AttributeList (optional)"],
                docs: "Set or return syntax attributes for fields displayed in grid columns (HID, NED, NPR, etc.).",
            },
            {
                name: "$componentinfo",
                params: ["string InstanceName", "string Topic"],
                docs: "Return component instance information ('VARIABLES' or 'OUTERENTITIES'). Topics are case-insensitive.",
            },
            {
                name: "$componentname",
                params: ["string InstanceName (optional)"],
                docs: "Return the name of the component from which the instance was created (uppercase).",
            },
            {
                name: "$componenttype",
                params: ["string InstanceName (optional)"],
                docs: "Return component type code: A=Shell, D=DSP, P=USP, F=Form, R=Report, S=Service, E=EntityService, N=SessionService.",
            },
            {
                name: "$concat",
                params: ["string String1", "string String2", "...", "string String5"],
                docs: "Concatenate up to 5 strings. Returns combined string.",
            },
            {
                name: "$condition",
                params: ["string Condition", "string DataList (optional)"],
                docs: "Evaluate conditional expression. Returns TRUE or FALSE. Supports runtime expression parsing.",
            },
            {
                name: "$cos",
                params: ["numeric X"],
                docs: "Return cosine of X (in radians).",
            },
            {
                name: "$CurEntProperties",
                params: ["string Entity", "string Properties (optional)"],
                docs: "Set or get properties for inner entities within current occurrence. Overrides default widget properties.",
            },
            {
                name: "$curhits",
                params: ["string Entity (optional)"],
                docs: "Return number of occurrences in hitlist (negative if partially built).",
            },
            {
                name: "$curkey",
                params: [],
                docs: "Return current key number in validateKey/leaveModifiedKey trigger (1=primary, >1=candidate).",
            },
            {
                name: "$curoccvideo",
                params: ["string Entity", "string Options (optional)", "string AttributeList (optional)"],
                docs: "Set video properties for current occurrence fields (HLT, INV, UND, COL=n). Options: 'inner' or 'up'.",
            },
            {
                name: "$curline",
                params: [],
                docs: "Return current line number in Unified editor. Only valid in Unifieds.",
            },
            {
                name: "$curword",
                params: [],
                docs: "Return word at cursor position in Unified. Used for context-sensitive help in Unifieds.",
            },
            {
                name: "$datacrrorcontext",
                params: [],
                docs: "Returns associative list with validation error context (CONTEXT, TOPIC, OCC, KEY, OBJECT, ERROR, STATUS). Used in error handling.",
            },
            {
                name: "$date",
                params: ["string Source (optional)"],
                docs: "Returns current date or converts string to Date type. Format depends on $nlslocale/$nlsformat settings.",
            },
            {
                name: "$datim",
                params: ["string Source (optional)"],
                docs: "Returns system datetime or converts string to Datetime type. Format: dd-mm-yyhh:nn:ss.tt",
            },
            {
                name: "$dberror",
                params: [],
                docs: "Returns DBMS-specific error code from last database operation. Consult DBMS documentation for codes.",
            },
            {
                name: "$dberrortext",
                params: [],
                docs: "Returns DBMS-specific error message text. Truncated if exceeds 1024 bytes.",
            },
            {
                name: "$dbocc",
                params: ["string Entity (optional)"],
                docs: "Returns sequence number of current occurrence in database (0 for new occurrences).",
            },
            {
                name: "$decode",
                params: ["string Algorithm", "string Source", "string Key", "string Mode (optional)", "string IV (optional)"],
                docs: "Decrypts data or verifies digital signatures. Supported algorithms: AES, DES, RSA, etc. Returns raw data.",
            },
            {
                name: "$direction",
                params: [],
                docs: "Returns structure editor mode: 0=Next, 1=Previous. Reset by editor functions like ANEXT, APREV.",
            },
            {
                name: "$disable",
                params: [],
                docs: "Controls menu item enable state (1=disabled, 0=enabled). Used in preDisplay trigger.",
            },
            {
                name: "$display",
                params: [],
                docs: "Returns current display device translation table name.",
            },
            {
                name: "$def_charset",
                params: ["string CharacterSet (optional)"],
                docs: "Gets/sets character set for C-packed string fields (e.g., 'CP1252', 'UTF8'). Must match DBMS charset.",
            },
            {
                name: "$detachedinstances",
                params: [],
                docs: "Returns list of instances not attached to another instance. For server components, returns server-side instances only.",
            },
            {
                name: "$dirlist",
                params: ["string DirPath", "string Topic (optional)"],
                docs: "Lists directory contents. Topic: 'FILE' (default) or 'DIR'. Supports wildcards (*, ?).",
            },
            {
                name: "$displaylength",
                params: ["string String"],
                docs: "Returns display length of string in system charset (in bytes). Accounts for multi-byte characters.",
            },
            {
                name: "$e",
                params: [],
                docs: "Returns mathematical constant e (Euler's number, ~2.718). Base of natural logarithm.",
            },
            {
                name: "$editmode",
                params: [],
                docs: "Gets/sets form edit mode: 0=Edit, 1=Query, 2=Display. Immediate effect when set.",
            },
            {
                name: "$empty",
                params: ["string Frame (optional)"],
                docs: "Checks if entity/frame is empty: 2=empty+suppressed, 1=empty, 0=has data.",
            },
            {
                name: "$encode",
                params: ["string Algorithm", "string Source", "string Key", "string Mode (optional)", "string IV (optional)"],
                docs: "Encrypts data or creates signatures. Algorithms: BASE64, AES, SHA256, etc. Returns raw data by default.",
            },
            {
                name: "$entinfo",
                params: ["string Entity", "string Topic"],
                docs: "Returns entity metadata. Topics: DATACCESS, DBMSPATH, INNER, OUTER, PAINTEDFIELDS, SUPERTYPE.",
            },
            {
                name: "$entityproperties",
                params: ["string Entity", "string Properties (optional)"],
                docs: "Gets/sets visual properties for all occurrences of an entity (colors, borders, etc.).",
            },
            {
                name: "$entname",
                params: ["string Entity (optional)"],
                docs: "Returns current entity name or checks if entity exists in component. Uppercase return value.",
            },
            {
                name: "$error",
                params: [],
                docs: "Returns Uniface error number in error trigger. Used for custom error handling.",
            },
            {
                name: "$equalStructRefs",
                params: ["struct Struct1", "struct Struct2"],
                docs: "Checks if two struct variables reference the same physical struct (1=yes, 0=no).",
            },
            {
                name: "$exp",
                params: ["numeric X"],
                docs: "Calculates e^X (exponential). X range: ~-23025 to +23025.",
            },
            {
                name: "$exp10",
                params: ["numeric X"],
                docs: "Calculates 10^X (base-10 exponential). X range: -9999 to +9999.",
            },
            {
                name: "$expression",
                params: ["string Expression", "string DataList (optional)"],
                docs: "Evaluates non-conditional expression at runtime. Returns calculated result.",
            },
            {
                name: "$fact",
                params: ["numeric X"],
                docs: "Calculates factorial (X!). X must be positive integer <3249.",
            },
            {
                name: "$fieldcheck",
                params: ["string Field (optional)"],
                docs: "Gets/sets field validation requirement (1=force validation, 0=default behavior).",
            },
            {
                name: "$fielddbmod",
                params: ["string Field (optional)"],
                docs: "Checks if database field was modified (1=modified, 0=unchanged/not-db-field).",
            },
            {
                name: "$fielddbvalue",
                params: ["string Field (optional)"],
                docs: "Returns original field value as retrieved from database. Empty for new occurrences.",
            },
            {
                name: "$fieldendmod",
                params: ["string Field (optional)"],
                docs: "Returns 1 if field was modified when exited (used in loseFocus trigger), 0 otherwise.",
            },
            {
                name: "$fieldhandle",
                params: ["string Field (optional)"],
                docs: "Returns handle to widget bound to current field occurrence. Used for widget operations.",
            },
            {
                name: "$fieldindb",
                params: ["string Field (optional)"],
                docs: "Checks if field is a database field (1=yes, 0=no). Equivalent to Is External property.",
            },
            {
                name: "$fieldinfo",
                params: ["string Field", "string Topic"],
                docs: "Returns field metadata. Topics: CHARACTERISTICS, DATATYPE, PAINTED, SYNTAX.",
            },
            {
                name: "$fieldmod",
                params: ["string Field (optional)"],
                docs: "Returns 1 if field was modified during lifetime in component, 0 otherwise.",
            },
            {
                name: "$fieldname",
                params: ["string Field (optional)"],
                docs: "Returns current field name or checks if field exists in component. Uppercase return value.",
            },
            {
                name: "$fieldprofile",
                params: ["string Field (optional)"],
                docs: "Returns 1 if profile character entered in field (used in validate/loseFocus triggers).",
            },
            {
                name: "$fieldproperties",
                params: ["string Field", "string PropertyList (optional)"],
                docs: "Gets/sets widget properties for field instance (colors, fonts, etc.).",
            },
            {
                name: "$fieldsyntax",
                params: ["string Field", "string AttributeList (optional)"],
                docs: "[Deprecated] Use $columnsyntax instead. Controls field display attributes (HID, NED, etc.).",
            },
            {
                name: "$fieldvalrep",
                params: ["string Field"],
                docs: "Gets/sets ValRep list for field. Format: 'display1=value1;display2=value2'.",
            },
            {
                name: "$fieldvalidation",
                params: ["string Field (optional)"],
                docs: "Returns 1 if field requires validation, 0 otherwise. Read-only property.",
            },
            {
                name: "$fieldvideo",
                params: ["string Field", "string AttributeList"],
                docs: "Sets video attributes for field (BLT, INV, UND, COL=n). Overrides occurrence settings.",
            },
            {
                name: "$fileexists",
                params: ["string FilePath"],
                docs: "Checks if file exists (1=exists, 0=doesn't exist). Supports path redirections.",
            },
            {
                name: "$fileproperties",
                params: ["string FilePath", "string Topic"],
                docs: "Returns file metadata. Topics: DATE, TIME, SIZE, READONLY, EXISTS, PATH.",
            },
            {
                name: "$foreign",
                params: ["string Field"],
                docs: "Returns foreign key value for field. Empty if not a foreign key field.",
            },
            {
                name: "$format",
                params: ["string Source", "string FormatString"],
                docs: "Formats value according to format string (similar to printf). Returns formatted string.",
            },
            {
                name: "$formdb",
                params: [],
                docs: "[Deprecated] Legacy function for form database operations. Do not use in new code.",
            },
            {
                name: "$formdbmod",
                params: [],
                docs: "[Deprecated] Legacy function for form modification tracking. Do not use in new code.",
            },
            {
                name: "$formfocus",
                params: [],
                docs: "Returns name of field/entity that currently has focus. Empty if no focus.",
            },
            {
                name: "$formmod",
                params: [],
                docs: "[Deprecated] Legacy form modification flag. Do not use in new code.",
            },
            {
                name: "$formmodality",
                params: [],
                docs: "Returns form modality state: 1=modal, 0=non-modal. Read-only property.",
            },
            {
                name: "$formname",
                params: [],
                docs: "[Deprecated] Legacy form name function. Use $componentname instead.",
            },
            {
                name: "$formtitle",
                params: [],
                docs: "Returns title of current form. Can be used to get window title in GUI applications.",
            },
            {
                name: "$frac",
                params: ["numeric Value"],
                docs: "Returns fractional part of number. Example: $frac(3.1415) returns 0.1415.",
            },
            {
                name: "$framedepth",
                params: ["string Frame"],
                docs: "Returns nesting depth of named frame. Used in complex form layouts.",
            },
            {
                name: "$gui",
                params: [],
                docs: "Returns GUI mode indicator: 1=GUI mode, 0=character mode.",
            },
            {
                name: "$hide",
                params: [],
                docs: "Controls menu item visibility (1=hidden, 0=visible). Used in preDisplay trigger.",
            },
            {
                name: "$hits",
                params: ["string Entity (optional)"],
                docs: "Returns total occurrences matching retrieve (including not yet loaded).",
            },
            {
                name: "$idpart",
                params: ["string IDString"],
                docs: "Extracts ID part from composite string (before first dot). Returns empty if no dot.",
            },
            {
                name: "$inlinemenu",
                params: ["string Items", "string Options"],
                docs: "Displays popup menu at current position. Items format: 'text1=value1;text2=value2'.",
            },{
                name: "$instancechildren",
                params: ["string InstanceName (optional)"],
                docs: "Returns list of child instances attached to specified instance. Empty for detached instances.",
            },
            {
                name: "$instancedb",
                params: ["string InstanceName"],
                docs: "Returns database path identifier for component instance (3-letter code like 'ORA').",
            },
            {
                name: "$instancedbmod",
                params: ["string InstanceName"],
                docs: "Checks if instance has database modifications (1=modified, 0=unchanged).",
            },
            {
                name: "$instancehandle",
                params: ["string InstanceName"],
                docs: "Returns handle to specified component instance. Used for instance operations.",
            },
            {
                name: "$instancelayout",
                params: ["string InstanceName"],
                docs: "Returns layout information for instance. Format depends on component type.",
            },
            {
                name: "$instancemod",
                params: ["string InstanceName"],
                docs: "Checks if instance has modifications (1=modified, 0=unchanged). Includes non-database changes.",
            },
            {
                name: "$instancename",
                params: [],
                docs: "Returns name of current component instance. Uppercase return value.",
            },
            {
                name: "$instanceparent",
                params: ["string InstanceName (optional)"],
                docs: "Returns parent instance name. Empty for detached instances or application shell.",
            },
            {
                name: "$instancepath",
                params: ["string InstanceName"],
                docs: "Returns full hierarchical path of instance (e.g., 'PARENT.CHILD').",
            },
            {
                name: "$instances",
                params: ["string ComponentName (optional)"],
                docs: "Returns list of all active instances, optionally filtered by component name.",
            },
            {
                name: "$instancevalidation",
                params: ["string InstanceName"],
                docs: "Checks if instance requires validation (1=needs validation, 0=valid).",
            },
            {
                name: "$int",
                params: ["numeric Value"],
                docs: "Returns integer part of number (truncates decimal portion).",
            },
            {
                name: "$interactive",
                params: [],
                docs: "Returns interactive mode status (1=interactive, 0=batch). Opposite of $batch.",
            },
            {
                name: "$ioprint",
                params: ["string Text"],
                docs: "Directly outputs text to printer. Used in batch/report components.",
            },
            {
                name: "$italic",
                params: ["string Text"],
                docs: "Applies italic style to text. Only visible in displayed Unifieds.",
            },
            {
                name: "$item",
                params: ["string List", "numeric Position"],
                docs: "Returns item at specified position in Uniface list (1-based index).",
            },
            {
                name: "$itemcount",
                params: ["string List"],
                docs: "Returns number of items in Uniface list. Counts GOLD semicolon separators.",
            },
            {
                name: "$itemnr",
                params: ["string List", "string Value"],
                docs: "Returns position of value in Uniface list (0 if not found). Case-sensitive.",
            },
            {
                name: "$keyboard",
                params: [],
                docs: "Returns current keyboard translation table name.",
            },
            {
                name: "$keycheck",
                params: ["string KeyName"],
                docs: "Validates key field value (1=valid, 0=invalid). Used in validateKey triggers.",
            },
            {
                name: "$keyfields",
                params: ["string Entity", "numeric KeyNumber"],
                docs: "Returns list of fields composing specified key. KeyNumber: 1=primary, >1=candidate.",
            },
            {
                name: "$keymod",
                params: ["string Entity", "numeric KeyNumber"],
                docs: "Checks if key fields were modified (1=modified, 0=unchanged).",
            },
            {
                name: "$keytype",
                params: ["string Entity", "numeric KeyNumber"],
                docs: "Returns key type: 'P'=primary, 'C'=candidate, 'A'=alternate.",
            },
            {
                name: "$keyvalidation",
                params: ["string Entity", "numeric KeyNumber"],
                docs: "Checks if key requires validation (1=needs validation, 0=valid).",
            },
            {
                name: "$labelproperties",
                params: ["string Field"],
                docs: "Gets/sets label properties for field. Format: 'text=Label;font=Arial'.",
            },
            {
                name: "$language",
                params: [],
                docs: "Returns current language setup code. Can be set via assignment file.",
            },
            {
                name: "$lines",
                params: ["string Text"],
                docs: "Counts lines in text string. Uses current platform line separators.",
            },
            {
                name: "$ldir",
                params: ["string DirPath"],
                docs: "[Obsolete] Legacy directory listing. Use $dirlist instead.",
            },
            {
                name: "$ldirlist",
                params: ["string DirPath", "string Topic"],
                docs: "[Obsolete] Legacy directory listing with topics. Use $dirlist instead.",
            },
            {
                name: "$length",
                params: ["string Text"],
                docs: "Returns character length of string (not bytes). Handles multi-byte characters.",
            },
            {
                name: "$lfileexists",
                params: ["string FilePath"],
                docs: "[Obsolete] Legacy file existence check. Use $fileexists instead.",
            },
            {
                name: "$lfileproperties",
                params: ["string FilePath", "string Topic"],
                docs: "[Obsolete] Legacy file properties. Use $fileproperties instead.",
            },
            {
                name: "$log",
                params: ["numeric X"],
                docs: "Returns natural logarithm (base e) of X. X must be positive.",
            },
            {
                name: "$log10",
                params: ["numeric X"],
                docs: "Returns base-10 logarithm of X. X must be positive.",
            },
            {
                name: "$logical",
                params: ["any Value"],
                docs: "Converts value to logical (1=TRUE, 0=FALSE). Non-zero numbers become 1.",
            },
            {
                name: "$lowercase",
                params: ["string Text"],
                docs: "Converts string to lowercase according to current language settings.",
            },
            {
                name: "$ltrim",
                params: ["string Text"],
                docs: "Removes leading whitespace from string. Respects Unicode spaces.",
            },
            {
                name: "$modelname",
                params: [],
                docs: "Returns name of current model. Empty if no model is current.",
            },
            {
                name: "$msgdata",
                params: [],
                docs: "Returns data portion of received message. Used in receiveMessage trigger.",
            },
            {
                name: "$msgdst",
                params: [],
                docs: "Returns destination instance name for sent messages.",
            },
            {
                name: "$msgid",
                params: [],
                docs: "Returns message ID for received messages. Used for message correlation.",
            },
            {
                name: "$msginfo",
                params: ["string Topic"],
                docs: "Returns message metadata. Topics: TYPE, PRIORITY, TIMESTAMP, etc.",
            },
            {
                name: "$msgsrc",
                params: [],
                docs: "Returns source instance name for received messages.",
            },
            {
                name: "$newstruct",
                params: [],
                docs: "Creates and returns new empty struct. Used for dynamic data structures.",
            },
            {
                name: "$next",
                params: [],
                docs: "Checks if in 'next' direction in structure editor (1=next, 0=previous).",
            },
            {
                name: "$nlscase",
                params: ["string Text", "string Operation"],
                docs: "Performs locale-aware case conversion. Operations: 'LOWER', 'UPPER', 'TITLE'.",
            },
            {
                name: "$nlsformat",
                params: ["string Value", "string Format"],
                docs: "Formats value according to locale-specific rules. Uses OS locale settings.",
            },
            {
                name: "$nlsinternaltime",
                params: ["string Time"],
                docs: "Converts time to internal format according to locale settings.",
            },
            {
                name: "$nlslocale",
                params: ["string Locale (optional)"],
                docs: "Gets/sets current locale (e.g., 'en_US', 'pt_BR'). Affects date/number formatting.",
            },
            {
                name: "$nlslocalelist",
                params: [],
                docs: "Returns a list of available locales that can be used with $nlslocale.",
            },
            {
                name: "$nlssortorder",
                params: [],
                docs: "Returns the current sort order for string comparison operations.",
            },
            {
                name: "$nlstimezone",
                params: [],
                docs: "Returns the current timezone setting for the application.",
            },
            {
                name: "$nlstimezonelist",
                params: [],
                docs: "Returns a list of available timezones that can be used with $nlstimezone.",
            },
            {
                name: "$nmforms",
                params: [],
                docs: "Returns the number of forms currently active in the application.",
            },
            {
                name: "$number",
                params: ["string Source"],
                docs: "Converts a string to a numeric value according to the current locale settings.",
            },
            {
                name: "$occcheck",
                params: ["string Entity"],
                docs: "Checks if an occurrence exists for the specified entity.",
            },
            {
                name: "$occcrc",
                params: ["string Entity"],
                docs: "Returns a CRC (Cyclic Redundancy Check) value for the current occurrence of an entity.",
            },
            {
                name: "$occdbmod",
                params: ["string Entity"],
                docs: "Returns the modification status of a database occurrence.",
            },
            {
                name: "$occdel",
                params: ["string Entity"],
                docs: "Returns the deletion status of an occurrence.",
            },
            {
                name: "$occdepth",
                params: ["string Entity"],
                docs: "Returns the depth level of an occurrence in a hierarchical structure.",
            },
            {
                name: "$occhandle",
                params: ["string Entity"],
                docs: "Returns a handle to the current occurrence of an entity.",
            },
            {
                name: "$occmod",
                params: ["string Entity"],
                docs: "Returns the modification status of an occurrence.",
            },
            {
                name: "$occproperties",
                params: ["string Entity"],
                docs: "Returns or sets properties for the current occurrence of an entity.",
            },
            {
                name: "$occstatus",
                params: ["string Entity"],
                docs: "Returns the status of the current occurrence (new, modified, etc.).",
            },
            {
                name: "$occvalidation",
                params: ["string Entity"],
                docs: "Returns or sets the validation status of an occurrence.",
            },
            {
                name: "$ocxhandle",
                params: ["string ControlName"],
                docs: "Returns a handle to an OCX (OLE Custom Control) or ActiveX control.",
            },
            {
                name: "$oprsys",
                params: [],
                docs: "Returns information about the operating system where Uniface is running.",
            },
            {
                name: "$page",
                params: [],
                docs: "Returns the current page number when printing.",
            },
            {
                name: "$paintedfieldproperties",
                params: ["string Field"],
                docs: "Returns properties of a painted field in the component.",
            },
            {
                name: "$paintedocc",
                params: ["string Entity"],
                docs: "Returns the occurrence number of the currently painted occurrence.",
            },
            {
                name: "$password",
                params: ["string Prompt"],
                docs: "Displays a password dialog box and returns the entered password.",
            },
            {
                name: "$pi",
                params: [],
                docs: "Returns the value of π (pi).",
            },
            {
                name: "$power",
                params: ["numeric X", "numeric Y"],
                docs: "Returns X raised to the power of Y.",
            },
            {
                name: "$previous",
                params: [],
                docs: "Returns the previous value in the structure editor navigation sequence.",
            },
            {
                name: "$printing",
                params: [],
                docs: "Returns whether the component is currently in printing mode.",
            },
            {
                name: "$proc_profiling",
                params: [],
                docs: "Returns or sets the ProcScript profiling status.",
            },
            {
                name: "$proc_tracing",
                params: [],
                docs: "Returns or sets the ProcScript tracing status.",
            },
            {
                name: "$proc_tracing_addition",
                params: [],
                docs: "Returns additional tracing information when ProcScript tracing is enabled.",
            },
            {
                name: "$processinfo",
                params: [],
                docs: "Returns information about the current Uniface process.",
            },
            {
                name: "$procerror",
                params: [],
                docs: "Returns the last ProcScript error code.",
            },
            {
                name: "$procerrorcontext",
                params: [],
                docs: "Returns additional context information about the last ProcScript error.",
            },
            {
                name: "$procReturnContext",
                params: [],
                docs: "Returns the context of the last procedure return.",
            },
            {
                name: "$prompt",
                params: ["string Message"],
                docs: "Displays a prompt dialog box and returns the user's response.",
            },
            {
                name: "$properties",
                params: ["string Object"],
                docs: "Returns or sets properties of various Uniface objects.",
            },
            {
                name: "$putmess",
                params: ["string Message"],
                docs: "Outputs a message to the message frame or console.",
            },
            {
                name: "$relation",
                params: ["string Entity1", "string Entity2"],
                docs: "Returns information about the relationship between two entities.",
            },
            {
                name: "$replace",
                params: ["string Source", "numeric StartPos", "string SearchFor", "string ReplaceWith", "numeric Count"],
                docs: "Replaces occurrences of Old with New in Source string.",
            },
            {
                name: "$result",
                params: [],
                docs: "Returns the result of the last string operation.",
            },
            {
                name: "$rettype",
                params: [],
                docs: "Returns the type of the last structure editor return operation.",
            },
            {
                name: "$rscan",
                params: ["string Source", "string Search"],
                docs: "Scans a string from right to left for a substring.",
            },
            {
                name: "$rtrim",
                params: ["string Source"],
                docs: "Removes trailing spaces from a string.",
            },
            {
                name: "$runmode",
                params: [],
                docs: "Returns the current run mode of the Uniface application.",
            },
            {
                name: "$scan",
                params: ["string Source", "string Search"],
                docs: "Scans a string from left to right for a substring.",
            },
            {
                name: "$selblk",
                params: [],
                docs: "Returns the currently selected block in a text field.",
            },
            {
                name: "$selected",
                params: ["string Entity"],
                docs: "Returns whether the specified occurrence is selected.",
            },
            {
                name: "$selectedoccs",
                params: ["string Entity"],
                docs: "Returns a collection of selected occurrences for an entity.",
            },
            {
                name: "$selectlist",
                params: ["string List"],
                docs: "Displays a selection list dialog and returns the user's choice.",
            },
            {
                name: "$setting",
                params: ["string SettingName"],
                docs: "Returns or sets various Uniface settings and environment variables.",
            },
            {
                name: "$signatureproperties",
                params: ["string Signature"],
                docs: "Returns properties of a digital signature.",
            },
            {
                name: "$sin",
                params: ["numeric X"],
                docs: "Returns the sine of X (in radians).",
            },
            {
                name: "$sortlist",
                params: ["string List"],
                docs: "Sorts a Uniface list according to the current locale settings.",
            },
            {
                name: "$sortlistid",
                params: ["string List"],
                docs: "Sorts a Uniface list while preserving item IDs.",
            },
            {
                name: "$split",
                params: ["string Source", "numeric StartPos", "string SearchFor", "string LeftPart", "string RightPart"],
                docs: "Splits a string into parts using the specified delimiter.",
            },
            {
                name: "$sqrt",
                params: ["numeric X"],
                docs: "Returns the square root of X.",
            },
            {
                name: "$status",
                params: [],
                docs: "Returns the status of the last executed operation.",
            },
            {
                name: "$storetype",
                params: ["string Entity"],
                docs: "Returns the storage type of an entity (database, memory, etc.).",
            },
            {
                name: "$string",
                params: ["any Source"],
                docs: "Converts a value to a string representation.",
            },
            {
                name: "$stripattributes",
                params: ["string Text"],
                docs: "Removes all video attributes (like bold, underline) from the specified text.",
            },
            {
                name: "$subsetreturn",
                params: ["string Source", "string Delimiter", "numeric Position"],
                docs: "Returns a subset of a delimited string based on position.",
            },
            {
                name: "$syntax",
                params: ["string Field"],
                docs: "Returns the current syntax attributes (HID, NED, etc.) for a field.",
            },
            {
                name: "$sys_charset",
                params: [],
                docs: "Returns the current system character set being used by Uniface.",
            },
            {
                name: "$tan",
                params: ["numeric X"],
                docs: "Returns the tangent of X (in radians).",
            },
            {
                name: "$text",
                params: ["string MessageID"],
                docs: "Retrieves a text message from the message table based on its ID.",
            },
            {
                name: "$textexist",
                params: ["string MessageID"],
                docs: "Checks if a text message exists in the message table.",
            },
            {
                name: "$totdbocc",
                params: ["string Entity"],
                docs: "Returns the total number of database occurrences for an entity.",
            },
            {
                name: "$totkeys",
                params: ["string Entity"],
                docs: "Returns the total number of keys defined for an entity.",
            },
            {
                name: "$totlines",
                params: ["string Field"],
                docs: "Returns the total number of lines in a multi-line field.",
            },
            {
                name: "$totocc",
                params: ["string Entity"],
                docs: "Returns the total number of occurrences for an entity in the component.",
            },
            {
                name: "$typed",
                params: ["string Field"],
                docs: "Returns whether data has been typed into a field (not pasted or initialized).",
            },
            {
                name: "$ude",
                params: ["string Operation", "string Parameters"],
                docs: "Universal Development Environment function for various IDE operations.",
            },
            {
                name: "$underline",
                params: ["string Text"],
                docs: "Applies underline attribute to the specified text.",
            },
            {
                name: "$uppercase",
                params: ["string Text"],
                docs: "Converts a string to uppercase according to current locale settings.",
            },
            {
                name: "$user",
                params: [],
                docs: "Returns the current user ID of the logged-in user.",
            },
            {
                name: "$uuid",
                params: [],
                docs: "Generates and returns a Universally Unique Identifier (UUID).",
            },
            {
                name: "$valrep",
                params: ["string Field"],
                docs: "Returns or sets the value/representation list for a field.",
            },
            {
                name: "$valuepart",
                params: ["string Text"],
                docs: "Extracts the value part from a string that contains both value and representation.",
            },
            {
                name: "$variation",
                params: [],
                docs: "Returns the current language variation code (like 'US' for English-US).",
            },
            {
                name: "$web",
                params: [],
                docs: "Returns whether the application is running in a web environment.",
            },
            {
                name: "$webinfo",
                params: ["string Topic"],
                docs: "Returns various web-related information (cookies, headers, etc.).",
            },
            {
                name: "$webrequesttype",
                params: [],
                docs: "Returns the type of the current web request (GET, POST, etc.).",
            },
            {
                name: "$webresponsetype",
                params: [],
                docs: "Returns the MIME type for the web response being generated.",
            },
            {
                name: "$widgetoperation",
                params: ["handle WidgetHandle", "string Operation", "any Parameters"],
                docs: "Performs operations on widgets through their handles.",
            },
            {
                name: "$windowproperties",
                params: ["string PropertyList"],
                docs: "Returns or sets properties of the application window.",
            }
        ];
    }
}
