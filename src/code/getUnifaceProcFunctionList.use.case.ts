import { getUnifaceProcFunctionLink } from './unifaceProcFunctionLinks';

export interface ProcFunction {
    name: string;
    params: string[];
    docs: string;
    link: string;
    deprecated?: boolean;
}

export class GetUnifaceProcFunctionList {
    public execute(): ProcFunction[] {
        return [
            {
                name: '$about',
                params: [],
                docs: 'Returns information about the current Uniface installation, version, and platform.',
            },
            {
                name: '$abs',
                params: ['numeric X'],
                docs: 'Return the absolute value of a numeric value.',
            },
            {
                name: '$acos',
                params: ['numeric X'],
                docs: 'Return the arc cosine of X.',
            },
            {
                name: '$applname',
                params: [],
                docs: 'Return the name of the Application Shell.',
            },
            {
                name: '$applproperties',
                params: ['string PropertyList'],
                docs: 'Set the presentation properties of the application shell.',
            },
            {
                name: '$appltitle',
                params: [],
                docs: 'Return or set the window title bar text of a Uniface Windows application.',
            },
            {
                name: '$asin',
                params: ['numeric X'],
                docs: 'Return the arc sine of X.',
            },
            {
                name: '$atan',
                params: ['numeric X'],
                docs: 'Return the arc tangent of X.',
            },
            {
                name: '$batch',
                params: [],
                docs: 'Return the batch mode indicator.',
            },
            {
                name: '$bold',
                params: ['string Text'],
                docs: 'Apply the bold character attribute to a string.',
            },
            {
                name: '$cellinfo',
                params: ['string InstanceName (optional)'],
                docs: 'Get an associative list with the dimensions of a character cell in pixels.',
            },
            {
                name: '$callup',
                params: [],
                docs: 'For the trigger that is currently being executed, call that same trigger one level up in the hierarchy. If the trigger is not defined one level up, then the next available level up is called (if applicable).',
            },
            {
                name: '$char',
                params: [],
                docs: 'In a Unifield, return the Uniface character code for the key that activated a trigger.',
            },
            {
                name: '$check',
                params: [],
                docs: 'Return or set the checked status of a menu item.',
            },
            {
                name: '$clock',
                params: ['string Source (optional)'],
                docs: 'Return the system time or convert the argument to the Time data type.',
            },
            {
                name: '$curocc',
                params: ['string Entity (optional)'],
                docs: 'Return the sequence number of the current occurrence in the hitlist.',
            },
            {
                name: '$clearselection',
                params: ['string Entity (optional)'],
                docs: 'Built-in entity operation that clears the $selected attribute of all occurrences of the entity.',
            },
            {
                name: '$collhandle',
                params: ['string Entity (optional)'],
                docs: 'Returns the handle of the specified entity.',
            },
            {
                name: '$columnsyntax',
                params: ['string Field', 'string AttributeList (optional)'],
                docs: 'Set or return the syntax attributes for the field displayed in a column of a grid or multi-occurrence list.',
            },
            {
                name: '$componentinfo',
                params: ['string InstanceName', 'string Topic'],
                docs: "Return information about a component instance.",
            },
            {
                name: '$componentname',
                params: ['string InstanceName (optional)'],
                docs: 'Return the name of the component from which the specified instance was created.',
            },
            {
                name: '$componentproperties',
                params: ['string InstanceName (optional)', 'string Properties (optional)'],
                docs: 'Return or set the definition-time widget properties of the current component instance.',
            },
            {
                name: '$componenttype',
                params: ['string InstanceName (optional)'],
                docs: 'Return the type of the specified component instance.',
            },
            {
                name: '$concat',
                params: ['string String1', 'string String2', '...', 'string String5'],
                docs: 'Concatenate up to 5 strings.',
            },
            {
                name: '$condition',
                params: ['string Condition', 'string DataList (optional)'],
                docs: 'Return the result of evaluating a conditional expression.',
            },
            {
                name: '$cos',
                params: ['numeric X'],
                docs: 'Return the cosine of X.',
            },
            {
                name: '$CurEntProperties',
                params: ['string Entity', 'string Properties (optional)'],
                docs: 'Set properties for an inner entity within the current occurrence of its parent entity.',
            },
            {
                name: '$curhits',
                params: ['string Entity (optional)'],
                docs: 'Return the number of occurrences in the hitlist.',
            },
            {
                name: '$curkey',
                params: [],
                docs: 'Return the number of the current key in a validateKey or leaveModifiedKey trigger.',
            },
            {
                name: '$curoccvideo',
                params: [
                    'string Entity',
                    'string Options (optional)',
                    'string AttributeList (optional)',
                ],
                docs: "Set or return the video properties for fields of the current occurrence.",
            },
            {
                name: '$curline',
                params: [],
                docs: 'Return the line on which the cursor is positioned in the current Unifield.',
            },
            {
                name: '$curword',
                params: [],
                docs: 'Return the word on which the cursor is positioned in the current Unifield.',
            },
            {
                name: '$dataerrorcontext',
                params: [],
                docs: 'Return the context of the last validation error.',
            },
            {
                name: '$date',
                params: ['string Source (optional)'],
                docs: 'Return the current date or convert the argument to the Date data type.',
            },
            {
                name: '$datim',
                params: ['string Source (optional)'],
                docs: 'Return the system date and time, or convert the argument to the Datetime data type.',
            },
            {
                name: '$dberror',
                params: [],
                docs: 'Return the error code reported by the DBMS.',
            },
            {
                name: '$dberrortext',
                params: [],
                docs: 'Return the text of an error reported by the DBMS.',
            },
            {
                name: '$dbocc',
                params: ['string Entity (optional)'],
                docs: 'Return the sequence number of the current occurrence within the set of occurrences retrieved from the database.',
            },
            {
                name: '$decode',
                params: [
                    'string Algorithm',
                    'string Source',
                    'string Key',
                    'string Mode (optional)',
                    'string IV (optional)',
                ],
                docs: 'Decrypt or decode data, or verify a message by means of a digital signature.',
            },
            {
                name: '$direction',
                params: [],
                docs: 'Return the structure editor mode (Next or Previous).',
            },
            {
                name: '$disable',
                params: [],
                docs: 'Disables a menu item in a menu object.',
            },
            {
                name: '$display',
                params: [],
                docs: 'Return the name of the current display device translation table.',
            },
            {
                name: '$def_charset',
                params: ['string CharacterSet (optional)'],
                docs: "Set or return the value of $DEF_CHARSET, which defines the character set used for storing data in String fields with C packing code.",
            },
            {
                name: '$detachedinstances',
                params: [],
                docs: 'Return a list of detached instances.',
            },
            {
                name: '$dirlist',
                params: ['string DirPath', 'string Topic (optional)'],
                docs: "Return the contents of the specified directory.",
            },
            {
                name: '$displaylength',
                params: ['string String'],
                docs: 'Return the display length of a String when displayed in the system character set.',
            },
            {
                name: '$e',
                params: [],
                docs: "Return the value of e (Euler's number), the base of the natural logarithm",
            },
            {
                name: '$editmode',
                params: [],
                docs: 'Return or set a value that determines the degree to which a user can change data on the form component.',
            },
            {
                name: '$empty',
                params: ['string Frame (optional)'],
                docs: 'Return the empty frame status for an entity or named area frame.',
            },
            {
                name: '$encode',
                params: [
                    'string Algorithm',
                    'string Source',
                    'string Key',
                    'string Mode (optional)',
                    'string IV (optional)',
                ],
                docs: 'Encrypt data, sign messages with digital signatures, or convert data from one encoding scheme to another.',
            },
            {
                name: '$entinfo',
                params: ['string Entity', 'string Topic'],
                docs: 'Return information about an entity.',
            },
            {
                name: '$entityproperties',
                params: ['string Entity', 'string Properties (optional)'],
                docs: 'Return or set the current representation properties of an entity.',
            },
            {
                name: '$entname',
                params: ['string Entity (optional)'],
                docs: 'Return the name of the current entity or check for the existence of an entity in the component.',
            },
            {
                name: '$error',
                params: [],
                docs: 'Returns the Uniface message number for the error.',
            },
            {
                name: '$equalStructRefs',
                params: ['struct Struct1', 'struct Struct2'],
                docs: 'Checks whether two variables of type struct reference the same physical Struct.',
            },
            {
                name: '$exp',
                params: ['numeric X'],
                docs: 'Return the exponential of X (e X ).',
            },
            {
                name: '$exp10',
                params: ['numeric X'],
                docs: 'Return the base 10 exponential of X (10X).',
            },
            {
                name: '$expression',
                params: ['string Expression', 'string DataList (optional)'],
                docs: 'Return the result of evaluating a nonconditional expression.',
            },
            {
                name: '$fact',
                params: ['numeric X'],
                docs: 'Calculate the factorial of X (X!).',
            },
            {
                name: '$fieldcheck',
                params: ['string Field (optional)'],
                docs: 'Return or set the requirement for field validation.',
            },
            {
                name: '$fielddbmod',
                params: ['string Field (optional)'],
                docs: 'Return the modification status of a database field.',
            },
            {
                name: '$fielddbvalue',
                params: ['string Field (optional)'],
                docs: 'Return the original value of a field as it was retrieved from the database.',
            },
            {
                name: '$fieldendmod',
                params: ['string Field (optional)'],
                docs: 'Return the modification status of a field when the field is exited.',
            },
            {
                name: '$fieldhandle',
                params: ['string Field (optional)'],
                docs: 'Return a partner handle to the widget that is currently bound to the specified field of the current occurrence.',
            },
            {
                name: '$fieldindb',
                params: ['string Field (optional)'],
                docs: 'Check whether a field is a database field, or not.',
            },
            {
                name: '$fieldinfo',
                params: ['string Field', 'string Topic'],
                docs: 'Return information about a field.',
            },
            {
                name: '$fieldmod',
                params: ['string Field (optional)'],
                docs: 'Return the modification status of a field.',
            },
            {
                name: '$fieldname',
                params: ['string Field (optional)'],
                docs: 'Return the name of the current field or check for the presence of a specified field in the component.',
            },
            {
                name: '$fieldprofile',
                params: ['string Field (optional)'],
                docs: 'Return a value that indicates whether the user has entered a profile character in a field.',
            },
            {
                name: '$fieldproperties',
                params: ['string Field', 'string PropertyList (optional)'],
                docs: 'Return or set the current widget properties of an instance of a field.',
            },
            {
                name: '$fieldsyntax',
                params: ['string Field', 'string AttributeList (optional)'],
                docs: 'ProcScript function to change the Field Syntax property of a field.',
            },
            {
                name: '$fieldvalrep',
                params: ['string Field'],
                docs: "Return or set the associative (ValRep) list for an instance of a field.",
            },
            {
                name: '$fieldvalidation',
                params: ['string Field (optional)'],
                docs: 'Identify whether a field requires validation.',
            },
            {
                name: '$fieldvideo',
                params: ['string Field', 'string AttributeList'],
                docs: 'Return or set the video attributes of the specified field.',
            },
            {
                name: '$fileexists',
                params: ['string FilePath'],
                docs: "Returns a value that indicates whether the specified file or directory exists.",
            },
            {
                name: '$fileproperties',
                params: ['string FilePath', 'string Topic'],
                docs: 'Return the properties of the specified file, directory, or zip archive, taking file redirections in the assignment file into account.',
            },
            {
                name: '$foreign',
                params: ['string Field'],
                docs: 'Return a boolean value that indicates whether the entity is an Up entity in the component structure.',
            },
            {
                name: '$format',
                params: ['string Source', 'string FormatString'],
                docs: 'Return the field data, formatted according to the display format (DIS).',
            },
            {
                name: '$formdb',
                params: [],
                docs: 'Return a value that indicates whether data in the current Form has been retrieved from a database.',
                deprecated: true,
            },
            {
                name: '$formdbmod',
                params: [],
                docs: 'Return the modification status of database fields in the current Form.',
                deprecated: true,
            },
            {
                name: '$formfocus',
                params: [],
                docs: 'Return the name of the Form instance that has focus.',
            },
            {
                name: '$formmod',
                params: [],
                docs: 'Return the modification status of data in the current Form component.',
                deprecated: true,
            },
            {
                name: '$formmodality',
                params: [],
                docs: 'Return an indication of the form modality for the requested form instance.',
            },
            {
                name: '$formname',
                params: [],
                docs: 'Return the name of the current Form component.',
                deprecated: true,
            },
            {
                name: '$formtitle',
                params: [],
                docs: 'Return or set the title of the window title containing the Form instance.',
            },
            {
                name: '$frac',
                params: ['numeric Value'],
                docs: 'Return the fractional part of X.',
            },
            {
                name: '$framedepth',
                params: ['string Frame'],
                docs: 'Return the number of lines needed to print a frame as drawn on the component, without allowing for expansion',
            },
            {
                name: '$gui',
                params: [],
                docs: 'Return the mnemonic (CHR or MSW) for the user interface.',
            },
            {
                name: '$hide',
                params: [],
                docs: 'Return or set the display status of a menu item.',
            },
            {
                name: '$hits',
                params: ['string Entity (optional)'],
                docs: 'Return the number of occurrences in the hitlist.',
            },
            {
                name: '$idpart',
                params: ['string IDString'],
                docs: 'Return the ID part of an associative list item.',
            },
            {
                name: '$inlinemenu',
                params: ['string Items', 'string Options'],
                docs: "Insert or retrieve one or more menu items at the location of a dynamic menu placeholder",
            },
            {
                name: '$instancechildren',
                params: ['string InstanceName (optional)'],
                docs: 'Return a list of component instances attached to a specified component instance.',
            },
            {
                name: '$instancedb',
                params: ['string InstanceName'],
                docs: "Return an indication whether data in the current instance has been retrieved from a database.",
            },
            {
                name: '$instancedbmod',
                params: ['string InstanceName'],
                docs: 'Return the modification status of database fields in the current component instance.',
            },
            {
                name: '$instancehandle',
                params: ['string InstanceName'],
                docs: 'Return the handle of the requested component instance.',
            },
            {
                name: '$instancelayout',
                params: ['string InstanceName'],
                docs: 'Return or set the layout property of the current component instance.',
            },
            {
                name: '$instancemod',
                params: ['string InstanceName'],
                docs: 'Return or set the modification status of data in the current component instance.',
            },
            {
                name: '$instancename',
                params: [],
                docs: 'Return the name of the current component instance.',
            },
            {
                name: '$instanceparent',
                params: ['string InstanceName (optional)'],
                docs: 'Return the name of the parent instance of the specified component instance.',
            },
            {
                name: '$instancepath',
                params: ['string InstanceName'],
                docs: "Return the path with which the current component instance is registered.",
            },
            {
                name: '$instanceproperties',
                params: ['string InstanceName (optional)', 'string Properties (optional)'],
                docs: 'Return or set the current runtime widget properties of current instance.',
            },
            {
                name: '$instances',
                params: ['string ComponentName (optional)'],
                docs: 'Return a list of component instances that belong to a specified component.',
            },
            {
                name: '$instancevalidation',
                params: ['string InstanceName'],
                docs: 'Identify whether data in the component instance requires validation.',
            },
            {
                name: '$int',
                params: ['numeric Value'],
                docs: 'Return the integer part of X.',
            },
            {
                name: '$interactive',
                params: [],
                docs: 'Return a boolean value indicating whether the current Form component is in interactive state.',
            },
            {
                name: '$ioprint',
                params: ['string Text'],
                docs: 'Return or set the message level in the message frame.',
            },
            {
                name: '$italic',
                params: ['string Text'],
                docs: 'Apply the italic character attribute to a string in a Unifield.',
            },
            {
                name: '$item',
                params: ['string ID', 'string list'],
                docs: 'Return the value that corresponds to a given ID in an associative list.',
            },
            {
                name: '$itemcount',
                params: ['string List'],
                docs: 'Return the number of items in a list.',
            },
            {
                name: '$itemnr',
                params: ['string List', 'string Value'],
                docs: 'Return the list item that corresponds to a given index number in a list.',
            },
            {
                name: '$keyboard',
                params: [],
                docs: 'Return or set the current keyboard translation table.',
            },
            {
                name: '$keycheck',
                params: ['string KeyName'],
                docs: 'Indicate whether a specified primary or candidate key should be validated.',
            },
            {
                name: '$keyfields',
                params: ['string Entity', 'numeric KeyNumber'],
                docs: 'Return a list of the fields that make up a primary or candidate key or index.',
            },
            {
                name: '$keymod',
                params: ['string Entity', 'numeric KeyNumber'],
                docs: 'Return a value indicating whether the specified key has been modified.',
            },
            {
                name: '$keytype',
                params: ['string Entity', 'numeric KeyNumber'],
                docs: "Return the type of the specified key.",
            },
            {
                name: '$keyvalidation',
                params: ['string Entity', 'numeric KeyNumber'],
                docs: 'Identify whether a primary or candidate key requires validation.',
            },
            {
                name: '$labelproperties',
                params: ['string Field'],
                docs: "Get and set the text of an associated label in a Form.",
            },
            {
                name: '$language',
                params: [],
                docs: 'Return or set the current language code used for language-related global objects and language setups.',
            },
            {
                name: '$lines',
                params: ['string Text'],
                docs: 'Return the number of lines remaining on the current page.',
            },
            {
                name: '$ldir',
                params: ['string DirPath'],
                docs: 'Return the name of the working directory.',
            },
            {
                name: '$ldirlist',
                params: ['string DirPath', 'string Topic'],
                docs: 'Return the contents of the specified directory.',
            },
            {
                name: '$length',
                params: ['string Text'],
                docs: 'Return the length of the specified argument.',
            },
            {
                name: '$lfileexists',
                params: ['string FilePath'],
                docs: 'Returns a value that indicates whether the specified file or directory exists.',
            },
            {
                name: '$lfileproperties',
                params: ['string FilePath', 'string Topic'],
                docs: 'Return the properties of the specified file, directory, or zip archive, ignoring any file redirections in the assignment file.',
            },
            {
                name: '$log',
                params: ['numeric X'],
                docs: 'Return the natural logarithm of X (log e X).',
            },
            {
                name: '$log10',
                params: ['numeric X'],
                docs: 'Return the base 10 logarithm of X (log10X).',
            },
            {
                name: '$logical',
                params: ['any Value'],
                docs: 'Return the value of an application logical.',
            },
            {
                name: '$lowercase',
                params: ['string Text'],
                docs: 'Convert a string to lowercase.',
            },
            {
                name: '$ltrim',
                params: ['string Text'],
                docs: 'Trim the left side of a string from the left, following a pattern.',
            },
            {
                name: '$modelname',
                params: [],
                docs: 'Return the value of the Model property (the suffix of the entity name) of the specified entity',
            },
            {
                name: '$msgdata',
                params: [],
                docs: 'Return the message data received from postmessage.',
            },
            {
                name: '$msgdst',
                params: [],
                docs: 'Return the name of the component instance to which a message was addressed.',
            },
            {
                name: '$msgid',
                params: [],
                docs: 'Return the identifier for a message received from postmessage.',
            },
            {
                name: '$msginfo',
                params: ['string Topic'],
                docs: 'Return the requested information about the latest message.',
            },
            {
                name: '$msgsrc',
                params: [],
                docs: 'Return the name of the component instance that sent the message.',
            },
            {
                name: '$newstruct',
                params: [],
                docs: 'Explicitly create a new Struct with no members.',
            },
            {
                name: '$next',
                params: [],
                docs: "Return the value of the next occurrence of a field.",
            },
            {
                name: '$nlscase',
                params: ['string Text', 'string Operation'],
                docs: "Return the current value of the NLS case setting, or set it to a new value to apply or ignore locale-based case conversion rules.",
            },
            {
                name: '$nlsformat',
                params: ['string Value', 'string Format'],
                docs: 'Set or return the current NLS format value, which determines how locale-sensitive data is displayed.',
            },
            {
                name: '$nlsinternaltime',
                params: ['string Time'],
                docs: 'Specify whether to use Coordinated Universal Time (UTC+00:00) as the internal time zone.',
            },
            {
                name: '$nlslocale',
                params: ['string Locale (optional)'],
                docs: "Set or return the current locale (language and country), or locale setting.",
            },
            {
                name: '$nlslocalelist',
                params: [],
                docs: 'Return a list of valid locales or the system locale.',
            },
            {
                name: '$nlssortorder',
                params: [],
                docs: 'Set or return the current sequencing rules to apply when sorting strings in entities and lists, or reading occurrences from the hitlist.',
            },
            {
                name: '$nlstimezone',
                params: [],
                docs: 'Return the current external time zone setting, or set it to a new value.',
            },
            {
                name: '$nlstimezonelist',
                params: [],
                docs: 'Returns a list of time zones or the system time zone.',
            },
            {
                name: '$nmforms',
                params: [],
                docs: 'Return a list of all non-modal form instances in the component pool.',
            },
            {
                name: '$number',
                params: ['string Source'],
                docs: 'Returns a numeric value derived from a numeric string.',
            },
            {
                name: '$occcheck',
                params: ['string Entity'],
                docs: 'Return or set the requirement for checking an occurrence.',
            },
            {
                name: '$occcrc',
                params: ['string Entity'],
                docs: 'Set or return the CRC checksum of an occurrence.',
            },
            {
                name: '$occdbmod',
                params: ['string Entity'],
                docs: 'Return the modification status of a database occurrence.',
            },
            {
                name: '$occdel',
                params: ['string Entity'],
                docs: 'Returns the removal status of an occurrence.',
            },
            {
                name: '$occdepth',
                params: ['string Entity'],
                docs: 'Return the depth of the occurrence in the layout.',
            },
            {
                name: '$occhandle',
                params: ['string Entity'],
                docs: 'Returns the handle of the current occurrence of the specified entity.',
            },
            {
                name: '$occmod',
                params: ['string Entity'],
                docs: 'Return the modification status of an occurrence.',
            },
            {
                name: '$occproperties',
                params: ['string Entity'],
                docs: 'Returns or sets the properties of an occurrence.',
            },
            {
                name: '$occstatus',
                params: ['string Entity'],
                docs: 'Returns the modification status for each disconnected occurrence in a component.',
            },
            {
                name: '$occvalidation',
                params: ['string Entity'],
                docs: 'Check whether an occurrence requires validation.',
            },
            {
                name: '$ocxhandle',
                params: ['string ControlName'],
                docs: 'Return the handle of the requested OCX object.',
            },
            {
                name: '$oprsys',
                params: [],
                docs: 'Return a mnemonic for the operating system used by Uniface.',
            },
            {
                name: '$page',
                params: [],
                docs: 'Return the current page number in a Report or Form while printing.',
            },
            {
                name: '$paintedfieldproperties',
                params: ['string Field'],
                docs: 'Return or set the position and size for a specific instance of a field widget in a Form.',
            },
            {
                name: '$paintedocc',
                params: ['string Entity'],
                docs: 'Return the number of occurrences the specified entity drawn (painted) on the foForm or Report.',
            },
            {
                name: '$password',
                params: ['string Prompt'],
                docs: 'Return the encrypted password used to log on to a database path.',
            },
            {
                name: '$pi',
                params: [],
                docs: 'Return the value of pi.',
            },
            {
                name: '$power',
                params: ['numeric X', 'numeric Y'],
                docs: 'Calculate the value of X raised to the power of Y (XY).',
            },
            {
                name: '$previous',
                params: [],
                docs: 'Return the value of the field in the previous occurrence.',
            },
            {
                name: '$printing',
                params: [],
                docs: 'Return a status indicating whether the current component is printing.',
            },
            {
                name: '$proc_profiling',
                params: [],
                docs: 'Activate Uniface profiling, or check whether it is already enabled.',
            },
            {
                name: '$proc_tracing',
                params: [],
                docs: 'Return the current status of ProcScript tracing, or activate or deactivate ProcScript tracing.',
            },
            {
                name: '$proc_tracing_addition',
                params: [],
                docs: 'Return the current value of $proc_tracing_addition, or add a prefix, which can contain a string or expression, to each line of ProcScript tracing information.',
            },
            {
                name: '$processinfo',
                params: [],
                docs: 'Returns information about a process. The returned information depends on the operating system.',
            },
            {
                name: '$procerror',
                params: [],
                docs: 'Return the reason for an error in ProcScript execution.',
            },
            {
                name: '$procerrorcontext',
                params: [],
                docs: 'Return the location of the error specified by $procerror.',
            },
            {
                name: '$procReturnContext',
                params: [],
                docs: 'Get context information about the value returned by the ProcScript instruction that last set $procReturnContext.',
            },
            {
                name: '$prompt',
                params: ['string Message'],
                docs: "Return or set the position for the cursor in the Form when the current ProcScript module ends.",
            },
            {
                name: '$properties',
                params: ['string Object'],
                docs: 'Return or set the current widget properties of a field.',
            },
            {
                name: '$putmess',
                params: ['string Message'],
                docs: 'Send a message to the message frame, or return the contents of the message frame.',
            },
            {
                name: '$random',
                params: [],
                docs: 'Generate a random string, raw data of a specified length, or a number between 0 and 1.',
            },
            {
                name: '$regex',
                params: [],
                docs: 'Convert a string to a regex string.',
            },
            {
                name: '$relation',
                params: ['string Entity1', 'string Entity2'],
                docs: 'Return the related key field.',
            },
            {
                name: '$replace',
                params: [
                    'string Source',
                    'numeric StartPos',
                    'string SearchFor',
                    'string ReplaceWith',
                    'numeric Count',
                ],
                docs: 'Search and replace a substring of a string. The search and replace is case-sensitive.',
            },
            {
                name: '$result',
                params: [],
                docs: 'Return the result of certain ProcScript commands and tree widget events.',
            },
            {
                name: '$rettype',
                params: [],
                docs: 'Return the retrieval mode of the outermost entity.',
            },
            {
                name: '$rscan',
                params: ['string Source', 'string Search'],
                docs: 'Find a substring within a string, starting from the end of the string.',
            },
            {
                name: '$rtrim',
                params: ['string Source'],
                docs: 'Trim a string on the right-hand side, following a pattern.',
            },
            {
                name: '$runmode',
                params: [],
                docs: 'Return an indication of how the form was started.',
                deprecated: true,
            },
            {
                name: '$scan',
                params: ['string Source', 'string Search'],
                docs: 'Returns the position of a substring within a string.',
            },
            {
                name: '$selblk',
                params: [],
                docs: 'Return or set the contents of a Form\'s select buffer, which contains text that can be accessed using runtime structure editor functions.',
            },
            {
                name: '$selected',
                params: ['string Entity'],
                docs: 'Built-in occurrence attribute that indicates whether the occurrence is selected.',
            },
            {
                name: '$selectedoccs',
                params: ['string Entity'],
                docs: 'Built-in entity attribute that contains a Struct of handles to occurrences that have been selected.',
            },
            {
                name: '$selectlist',
                params: ['string List'],
                docs: "Return or set the list of fields that can be read and stored in the database for a specified component entity.",
            },
            {
                name: '$setting',
                params: ['string SettingName'],
                docs: 'Retrieve, add, or change configuration settings. Depending on the platform, settings may be stored in initialization files, assignment files, environment variables, logicals, data areas, or the Windows Registry.',
            },
            {
                name: '$signatureproperties',
                params: ['string Signature'],
                docs: 'Dynamically set the signature properties (also known as connector options) for a Uniface URB connector, or retrieve those that have been dynamically set. Supported only by the SOAP U2.0 connector.',
            },
            {
                name: '$sin',
                params: ['numeric X'],
                docs: 'Return the sine of X.',
            },
            {
                name: '$sortlist',
                params: ['string List'],
                docs: 'Sort an associative list, an indexed list, or an indexed list of sublists.',
            },
            {
                name: '$sortlistid',
                params: ['string List'],
                docs: 'Sort an associative list in which the value part of each list item is an indexed list.',
            },
            {
                name: '$split',
                params: [
                    'string Source',
                    'numeric StartPos',
                    'string SearchFor',
                    'string LeftPart',
                    'string RightPart',
                ],
                docs: 'Split a string.',
            },
            {
                name: '$sqrt',
                params: ['numeric X'],
                docs: 'Returns the square root of X.',
            },
            {
                name: '$status',
                params: [],
                docs: 'Return or set the current condition code.',
            },
            {
                name: '$storetype',
                params: ['string Entity'],
                docs: 'Return the type of update for the current occurrence.',
            },
            {
                name: '$string',
                params: ['any Source'],
                docs: 'Returns a string containing the character represented by each named XML entity in the input parameter. (XML entities are character mappings, not Uniface entities.)',
            },
            {
                name: '$stripattributes',
                params: ['string Text'],
                docs: 'Return the result of removing character attributes, frames, and rulers from a string.',
            },
            {
                name: '$subsetreturn',
                params: ['string Source', 'string Delimiter', 'numeric Position'],
                docs: 'Return only the most recently retrieved occurrences of an entity to its operation entity parameter.',
            },
            {
                name: '$syntax',
                params: ['string Field'],
                docs: 'Convert a string to a syntax string.',
            },
            {
                name: '$sys_charset',
                params: [],
                docs: 'Set or return the value of $SYS_CHARSET, which defines the character set used to communicate with components that are not Unicode-based, for example C components.',
            },
            {
                name: '$tan',
                params: ['numeric X'],
                docs: 'Return the tangent of X.',
            },
            {
                name: '$text',
                params: ['string MessageID'],
                docs: 'Return the text of a message or help text.',
            },
            {
                name: '$textexist',
                params: ['string MessageID'],
                docs: 'Return an indication of whether the specified message or help text exists.',
            },
            {
                name: '$totdbocc',
                params: ['string Entity'],
                docs: 'Return the number of occurrences of the entity that have been retrieved from a database.',
            },
            {
                name: '$totkeys',
                params: ['string Entity'],
                docs: 'Return the total number of keys for an entity.',
            },
            {
                name: '$totlines',
                params: ['string Field'],
                docs: 'Return the total number of lines available on the page for printing.',
            },
            {
                name: '$totocc',
                params: ['string Entity'],
                docs: 'Return the number of occurrences of an entity in the component.',
            },
            {
                name: '$typed',
                params: ['string Field'],
                docs: 'Explicitly convert data to a specified data type.',
            },
            {
                name: '$ude',
                params: ['string Operation', 'string Parameters'],
                docs: 'Perform actions on Repository data and resources, including compiling, exporting, importing, and converting.',
            },
            {
                name: '$underline',
                params: ['string Text'],
                docs: 'Return the result of applying the underline character attribute to a string.',
            },
            {
                name: '$uppercase',
                params: ['string Text'],
                docs: 'Convert the specified string uppercase.',
            },
            {
                name: '$user',
                params: [],
                docs: 'Return the user name used to log on to a database path.',
            },
            {
                name: '$uuid',
                params: [],
                docs: 'Generate a globally unique identifier.',
            },
            {
                name: '$valrep',
                params: ['string Field'],
                docs: 'Return or set the ValRep used by a widget for a field.',
            },
            {
                name: '$valuepart',
                params: ['string Text'],
                docs: 'Return the value part of an associative list item.',
            },
            {
                name: '$variation',
                params: [],
                docs: "Return or specify the name of the library containing objects needed by the application or component.",
            },
            {
                name: '$web',
                params: [],
                docs: 'Return an indication of whether the current application was started by the Web Request Dispatcher (WRD) or Uniface Anywhere.',
            },
            {
                name: '$webinfo',
                params: ['string Topic'],
                docs: 'Return or set information about the current HTTP request or response.',
            },
            {
                name: '$webrequesttype',
                params: [],
                docs: 'Returns a value indicating the type of request from the browser for the current DSP component instance.',
            },
            {
                name: '$webresponsetype',
                params: [],
                docs: 'Returns a value indicating the response expected by the browser for the current DSP component instance.',
            },
            {
                name: '$widgetoperation',
                params: ['handle WidgetHandle', 'string Operation', 'any Parameters'],
                docs: 'Activates a widget operation of the references widget.',
            },
            {
                name: '$windowproperties',
                params: ['string PropertyList'],
                docs: 'Set or return the current window properties of a Form instance.',
            },
        ].map((procFunction) => ({
            ...procFunction,
            link: getUnifaceProcFunctionLink(procFunction.name),
        }));
    }
}
