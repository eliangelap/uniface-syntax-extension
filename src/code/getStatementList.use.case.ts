import type { ProcStatement } from './types/procStatement.type';

const LEGACY_DOCUMENTATION_BASE =
    'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/';
const OFFICIAL_DOCUMENTATION_BASE = 'https://docs.rocketsoftware.com/bundle/uniface_104/page/';

const toOfficialDocumentationLink = (link: string | undefined): string | undefined =>
    link?.replace(LEGACY_DOCUMENTATION_BASE, OFFICIAL_DOCUMENTATION_BASE);

export class GetStatementList {
    public execute(): ProcStatement[] {
        return [
            {
                name: 'activate',
                params: ['String InstName', 'Literal LitOperationName', 'String ArgumentList'],
                docs: 'Calls an operation on a component instance.',
                syntax: 'activate {/list | /sync | /async} | { /stateless} InstName{.LitOperationName ( {ArgumentList} ) }',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/activate_fxx1665702529732.html',
            },
            {
                name: 'addmonths',
                params: ['String Months', 'String Date', 'String ReferenceDate'],
                docs: 'Adds the specified number of months to the date, storing the result of the calculation in $result.',
                syntax: 'addmonths Months, Date {,ReferenceDate}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/addmonths_exh1665702554603.html',
            },
            {
                name: 'apexit',
                params: [],
                docs: 'Ends the application session immediately.',
                syntax: 'apexit',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/apexit_gyd1665702578128.html',
            },
            {
                name: 'apstart',
                params: [],
                docs: 'Pass control of the application to the component manager.',
                syntax: 'apstart',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/apstart_kww1665703003587.html',
            },
            {
                name: 'askmess',
                params: ['String MessageText', 'String MessageTitle', 'String Replies'],
                docs: "Display a message and wait for the user's response.",
                syntax: 'askmess {/nobeep} {/question | /info | /warning | /error} "MessageText{~MessageTitle}" {,Replies}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/askmess_flv1665703003661.html',
            },
            {
                name: 'blockdata',
                params: ['String BlockName', 'String Delimiter', 'String text'],
                docs: 'Defines a constant block of text.',
                syntax: 'BlockName: blockdata Delimiter ... ... text ... ... Delimiter',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/blockdata_ttw1665702607229.html',
            },
            {
                name: 'break',
                params: [],
                docs: 'Unconditionally exit a loop initiated by for, forentity, forlist, repeat, or while.',
                syntax: 'break',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/break_wrg1665702578278.html',
            },
            {
                name: 'call',
                params: ['Literal Library', 'Literal LitFunctionName', 'String ArgumentList'],
                docs: 'Execute the specified function or global ProcScript.',
                syntax: 'call {Library::}LitFunctionName { ( ArgumentList ) }',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/call_bka1665702579213.html',
            },
            { name: 'callfieldtrigger', params: [] },
            {
                name: 'case',
                params: [],
                docs: 'Defines a case in a selectcase block.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/case_ajr1665703003743.html',
            },
            {
                name: 'catch',
                params: ['Numeric ErrorNumbers'],
                docs: 'In a try...endtry block, introduces the code to catch and handle exceptions.',
                syntax: 'try <ProcScript that may throw an exception> {catch} {ErrorNumber1 {,ErrorNumberN}} <Procscript that handles the error > endtry',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/catch_lhc1665702761265.html',
            },
            {
                name: 'clear',
                params: ['String Entity'],
                docs: 'Clear data from the component or entity.',
                syntax: 'clear{/e Entity}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/clear_fas1665702598144.html',
            },
            {
                name: 'close',
                params: ['String PathName'],
                docs: 'Log off from the specified path or from all paths.',
                syntax: 'close {"PathName/net"}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/close_ifn1665702634315.html',
            },
            {
                name: 'clrmess',
                params: [],
                docs: 'Clear all text from the message frame and message line.',
                syntax: 'clrmess',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/clrmess_ylq1665702607548.html',
            },
            {
                name: 'colorbox',
                params: ['String Color'],
                docs: 'Start the Microsoft Windows Color dialog box.',
                syntax: 'colorbox {/hex | /rgb} {/full} {"Color"}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/colorbox_gix1665702628957.html',
            },
            {
                name: 'commit',
                params: ['String PathString'],
                docs: 'Commit a transaction to a DBMS or path.',
                syntax: 'commit {"PathString"}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/commit_lpl1665702560927.html',
            },
            {
                name: 'compare',
                params: ['String FieldList', 'Literal LitFieldName', 'String Entity'],
                docs: 'Compare fields of two adjacent occurrences.',
                syntax: 'compare{/previous | /next} (FieldList) {from Entity}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/compare_pbt1665702752111.html',
            },
            {
                name: 'componentToStruct',
                params: ['struct or any StructTarget', 'String EntityName'],
                docs: 'Writes component data to a Struct.',
                syntax: 'componentToStruct {/mod} {/one} {/reconnecttags} {/firetriggers} StructTarget {, EntityName}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/componenttostruct_lgx1665702565961.html',
            },
            {
                name: 'creocc',
                params: ['String Entity', 'Number OccurrenceNumber'],
                docs: 'Creates an empty occurrence of the specified entity.',
                syntax: 'creocc Entity, OccurrenceNumber',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/creocc_yrm1665702560304.html',
            },
            {
                name: 'curoccvideo',
                params: ['String Entity', 'String AttributeList'],
                docs: 'Set the video properties for fields of the current occurrence.',
                syntax: 'curoccvideo/inner "MyOuterEntity", "BRI"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/curoccvideo_ogj1665702645130.html',
            },
            {
                name: 'debug',
                params: [],
                docs: 'Start the Uniface Debugger.',
                syntax: `trigger exec
    debug
    edit
end ; exec`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/debug_tby1665703003886.html',
            },
            {
                name: 'delete',
                params: [],
                docs: 'Deletes the current occurrence from the database.',
                syntax: `trigger delete
    delete
end ; delete`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/delete_qcg1665702560609.html',
            },
            {
                name: 'deleteinstance',
                params: ['String InstanceName'],
                docs: 'Deletes an instance of a component.',
                syntax: `trigger apStart
    newinstance "form10", $1, "MODALITY=NON-MODAL"
    newinstance "form20", $2, "MODALITY=NON-MODAL"
    newinstance "form40", $3, "MODALITY=NON-MODAL"

    $1->EXEC()
    $2->EXEC()
    $3->EXEC()

    getitem $1, $detachedinstances, 1
    while ($status > 0)
        deleteinstance $1
        getitem $1, $detachedinstances, 1
    endwhile
end`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/deleteinstance_hye1665702580163.html',
            },
            {
                name: 'delitem',
                params: ['String List', 'Number N', 'String Index'],
                docs: 'Deletes an item from a list.',
                syntax: '$1 = ""',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/delitem_qcg1665702554103.html',
            },
            {
                name: 'deletesetting',
                params: ['String Source', 'String Setting', 'String Topic'],
                docs: 'Delete initialization settings, environment variables, or runtime settings.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/deletesetting_amg1665702698150.html',
            },
            {
                name: 'dircreate',
                params: ['String NewDirPath'],
                docs: 'Create the specified directory in the working directory.',
                syntax: 'dircreate "coffee"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/dircreate_geg1665702569579_2.html',
            },
            {
                name: 'dirdelete',
                params: ['String DirPath'],
                docs: 'Delete the specified directory.',
                syntax: `$dir$ = "drinks/tea/"

if ($dirlist($dir$, "dir") = "" & $dirlist($dir$, "file") = "")
    askmess/warning "Do you want to delete '%%$dir$'?", "Yes, No"
    if ($status = 1)
        ldirdelete $dir$
    else
        message/error "Directory '%%$dir$' is not empty!"
    endif
endif`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/dirdelete_btv1665702570243_2.html',
            },
            {
                name: 'dirrename',
                params: ['String DirPath', 'String NewDirName'],
                docs: 'Rename the specified directory.',
                syntax: 'dirrename "drinks/coffee/", "tea"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/dirrename_ocm1665702570475.html',
            },
            {
                name: 'discard',
                params: ['String Entity', 'Number FromOccurrence and ToOccurrence'],
                docs: 'Remove one or more occurrences from the component and the hitlist.',
                syntax: 'function discardtest clear/e "ENT1" retrieve/e "ENT1" setocc "ENT1",1 repeat selectcase P1.ENT1 case "1" setocc "ENT1", $curocc(ENT1) + 1 case "10" setocc "ENT1", $curocc(ENT1) + 1 elsecase discard endselectcase until ($status <=0) end',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/discard_lsx1665702598541.html',
            },
            {
                name: 'display',
                params: ['Literal LitFieldName'],
                docs: 'Presents the form on the screen as display-only.',
                syntax: `operation exec
    CUST_NBR = $1
    retrieve
    message "%%$hits customers match search profile"
    display CUSTNAME
end ; exec`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/display_ojk1665702596093.html',
            },
            {
                name: 'displaylength',
                params: [],
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/displaylength_deprecated__smc1665702782435.html',
                deprecated: true,
            },
            {
                name: 'done',
                params: [],
                docs: 'Exit from the ProcScript module without changing $status.',
                syntax: `trigger quit
    if ($formmod = 0)
        done
    else
        message "Data modified!! Use STORE before QUIT."
        return (-1)
    endif
end ; quit`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/done_lpo1665702578918.html',
            },
            {
                name: 'edit',
                params: ['Literal LitFieldName'],
                docs: 'Display the component in preparation for user input.',
                syntax: `operation exec
    CUST_NBR = $1
    retrieve
    message "Selected customer ready for editing."
    edit CUSTNAME
end ; exec`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/edit_gwk1665702595783.html',
            },
            {
                name: 'eject',
                params: [],
                docs: 'Eject a page when printing.',
                syntax: `trigger leavePrinted
    compare/next (INVDATE) from "INVOICE"
    ; Start a new page when the next invoice has a different date.
    if ($result = 0)
        eject
    endif
end`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/eject_vud1665702751551.html',
            },
            {
                name: 'else',
                params: [],
                docs: 'Introduces a logical expression in an if/endif conditional block.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/else_gsf1665703004031.html',
            },
            {
                name: 'elsecase',
                params: [],
                docs: 'Marks the ProcScript to be executed if none of the case expressions match in a selectcase block.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/elsecase_oek1665703004166.html',
            },
            {
                name: 'elseif',
                params: [],
                docs: 'Defines a condition to be evaluated in an if/endif conditional block.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/elseif_kyp1665703004235.html',
            },
            {
                name: 'end',
                params: [],
                docs: 'Marks the end of a ProcScript module, operation, or trigger.',
                syntax: `trigger store
    call LSTORE
end ; store

function LSTORE
    store
    if ($status < 0)
        message "Store error!"
        rollback
    else
        message "Store done."
        commit
    endif
end ; LSTORE`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/end_rjw1665702578992.html',
            },
            {
                name: 'endfor',
                params: [],
                docs: 'Ends a loop processing block started by for, forentity, or forlist.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/endfor_riw1665703004306.html',
            },
            {
                name: 'endif',
                params: [],
                docs: 'Defines the end of an if conditional block.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/endif_jzj1665703004378.html',
            },
            {
                name: 'endtry',
                params: [],
                docs: 'Defines the end of a try...endtry block used to handle exceptions.',
                syntax: 'try <ProcScript that may throw an exception> {catch} {ErrorNumber1 {, ErrorNumberN}} <Procscript that handles the error >} {rethrow} {finally} <ProcScript that will always execute, regardless of whether an error occurred or not> endtry',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/endtry_mrq1665702761335.html',
            },
            {
                name: 'endjavascript',
                params: [],
                docs: 'Defines the end of a JavaScript block.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/endjavascript_jao1665703004447.html',
            },
            {
                name: 'endparams',
                params: [],
                docs: 'Defines the end of a params block.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/endparams_qhv1665703004517.html',
            },
            {
                name: 'endscope',
                params: [],
                docs: 'Declares the end of a scope block in a Dynamic Server Page.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/endscope_ldz1665703004586.html',
            },
            {
                name: 'endselectcase',
                params: [],
                docs: 'Defines the end of a selectcase conditional block.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/endselectcase_npg1665703004658.html',
            },
            {
                name: 'endvariables',
                params: [],
                docs: 'Defines the end of a variables block.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/endvariables_wlt1665703004731.html',
            },
            {
                name: 'endwhile',
                params: [],
                docs: 'Ends a while loop.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/endwhile_alf1665703004801.html',
            },
            {
                name: 'entitycopy',
                params: [
                    'String Source',
                    'String Target',
                    'String OptionList',
                    'Description Option',
                    'Append the data to an existing XML file. Only applicable if Target is XML file. Note: It is not possible to append data to an XML file that was exported (rather than copied) from the Uniface Repository. append= True | False',
                    'Keep the file open in preparation for appending more data. By default, the file is flushed and closed each time. However, to improve performance in cases when appending to a file, use this option to keep the file open. If True , you must explicitly flush and close the file using flush or lflush . keepopen= True | False',
                    'Copy the output in primary key order. If True , the sort order is also affected by the database collation setting of the DBMS, which determines, for example, how special characters such as underscore (_) are sorted. If False , depending on the database used, the order in the XML file can differ in repeated exports, even if nothing has changed. sort= True | False',
                    'Use mapping functionality to determine how data is copied from existing entity and field definitions to new modeled entities and fields. MapFile —ASCII file containing mapping between source and target entity and field definitions. For more information, see Mapping Files . # —use Target Repository definitions to map all entities # Entity —use Target Repository definitions to map the specified entity # TargetEntity = SourceEntity —use Target Repository definitions to map a source entity to a target entity map= MapFile | # { Entity | TargetEntity = SourceEntity }',
                    'Copy selected occurrences. The SelectClause has the following syntax: Field 1 Operator ObjectSpec 1 { ; Field n Operator ObjectSpec n } { " } Field —name of a field in the source entity. Operator —logical operator preceded by GOLD, for example GOLD = ( = ) or GOLD > GOLD = ( > = ). ObjectSpec —string specifying the retrieve profile for objects to be copied. Use the subfield separator GOLD ! GOLD ; ( ! ; ) to specify multiple conditions. where= SelectClause',
                    'Use the specified database translation table for converting the data. A database translation table is a keyboard translation table that is used to convert character strings during database input or output. tran= TranslationTable',
                    'Library in which the TranslationTable is located. library= LibraryName',
                    'Indicate whether to overwrite existing occurrences having matching primary keys in the target DBMS. True —overwrite occurrences. Default. False —keep original data. supersede= True | False',
                    'Frequency with which a message is displayed, expressed as a number of occurrences. printinterval= Number',
                    'Frequency with which data is stored in the database, expressed as the number of occurrences. commitinterval= Number',
                ],
                docs: 'Copy one or more entity occurrences from a source database or XML file to another.',
                syntax: `; Copy data from a database to XML.
entitycopy "def:myent.mymodel", "xml:myexportfile.xml"
entitycopy "def:myent.mymodel", "xml:myzip.zip:myexportfile.xml"

; Copy data from XML to a database.
entitycopy "xml:myexportfile.xml", "def:myent.mymodel"`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/entitycopy_liq1665702696660.html',
            },
            {
                name: 'entry',
                params: [],
                docs: 'Declare a ProcScript entry, a script module that can be invoked from within the same component.',
                syntax: `entry doSomething returns string
    return ("I did something")
end`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/entry_aqg1665702579072.html',
            },
            {
                name: 'erase',
                params: ['String Entity'],
                docs: 'Activate the delete or deleteUp trigger for all occurrences in the component.',
                syntax: 'trigger erase ; of component if ($totocc(CUSTOMER) >= 1) askmess "%%$totocc(CUSTOMER) occurrences. Erase them all?" if ($status = 0) return endif endif erase if ($status <0) message "Erase error; see message frame" rollback else if ($status = 1) message "Erase is not allowed" else message "Erase was successful" commit if($status < 0) rollback endif endif endif end ; erase',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/erase_ztw1665702560685.html',
            },
            {
                name: 'exit',
                params: ['Number Expression', 'String InstName'],
                docs: 'Exits the current component instance and returns to the previous or specified instance.',
                syntax: `trigger accept
    $1 = CUSTNAME
    exit (1)
end ; accept`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/exit_hyy1665702577902.html',
            },
            {
                name: 'fieldsyntax',
                params: [],
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/fieldsyntax_deprecated__dau1665702630593.html',
                deprecated: true,
            },
            {
                name: 'fieldvideo',
                params: [],
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/fieldvideo_deprecated__gvt1665702645684.html',
                deprecated: true,
            },
            {
                name: 'filebox',
                params: ['String Filter', 'String DefaultDirectory'],
                docs: 'Displays a file selection box.',
                syntax: 'filebox "*.xml"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/filebox_nov1665702568299.html',
            },
            {
                name: 'filecopy',
                params: ['String FilePath', 'String DirPath', 'String NewFilePath'],
                docs: 'Copy a file to a target location.',
                syntax: 'filecopy "sub1dir/test.txt", "sub1dir/sub2dir/"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/filecopy_zzz1665702571008.html',
            },
            {
                name: 'filedelete',
                params: ['String FilePath'],
                docs: 'Delete the specified file.',
                syntax: 'filedelete "sub1dir/test.txt"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/filedelete_ini1665702571454.html',
            },
            {
                name: 'filedump',
                params: [
                    'String Source',
                    'String FileName',
                    'String UnicodeFormat',
                    'String CharSet',
                ],
                docs: 'Copy the contents of the source object to the specified file.',
                syntax: 'filedump { /text { /nobom } { /append } | /image | /raw | /web } Source, FileName { , UnicodeFormat | CharacterSet }',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/filedump_mjx1665702567776.html',
            },
            {
                name: 'fileload',
                params: [
                    'String FilePath',
                    'String Target',
                    'String UnicodeFormat',
                    'String CharSet',
                ],
                docs: 'Copy the contents of a file into a field or variable.',
                syntax: 'fileload { /text | /raw | /image | /web } FilePath, Target { , UnicodeFormat | CharSet }',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/fileload_rxb1665702568451.html',
            },
            {
                name: 'filemove',
                params: ['String FilePath', 'String DirPath', 'String NewFilePath'],
                docs: 'Move the specified file to the target location.',
                syntax: 'filemove "sub1dir/test.txt", "sub1dir/sub2dir/"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/filemove_nye1665702572153.html',
            },
            {
                name: 'filerename',
                params: ['String FilePath', 'String NewFileName'],
                docs: 'Rename a file in the same directory.',
                syntax: 'filerename "sub1dir/test.txt", "tested.txt"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/filerename_ehj1665702570774.html',
            },
            {
                name: 'finally',
                params: [],
                docs: 'Declares ProcScript inside a try-endtry block that must be executed, regardless of whether an exception occurs or not.',
                syntax: 'try <ProcScript that might throw an exception> catch { Error1 { , ErrorN }} <ProcScript that will execute for the specified Error(s)> finally <ProcScript that will always execute, regardless of whether an error occurred or not> endtry',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/finally_nab1665702580017.html',
            },
            {
                name: 'findkey',
                params: ['String Entity', 'Number KeyNumber'],
                docs: 'Check if the key value of an entity exists.',
                syntax: 'findkey $entname, 1',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/findkey_dey1665702662999.html',
            },
            {
                name: 'flush',
                params: ['String ZipArchive', 'String XmlFile'],
                docs: 'Complete a file management transaction for the specified open zip archive or XML file, then close the file.',
                syntax: 'filedump "abc", "C:/Uniface/Uniface96_Data/project/b5.zip:dir1/def.txt" flush "C:/Uniface/Uniface96_Data/project/b5.zip:"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/flush_zyq1665702572315.html',
            },
            { name: 'for', params: [] },
            { name: 'forentity', params: [] },
            { name: 'forlist', params: [] },
            { name: 'forlist/id', params: [] },
            { name: 'from', params: [] },
            {
                name: 'getitem',
                params: [
                    'String Target',
                    'String IndexList AssociativeList',
                    'Number Index',
                    'String ItemID',
                ],
                docs: 'Copy an item from a list to a field or variable.',
                syntax: `$valrep(DBMSFLD) = "mss ; ora ; syb ; db2"
getitem vItem, $valrep(DBMSFLD), 3
; vItem contains "syb".`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/getitem_tud1665702559677.html',
            },
            {
                name: 'getlistitems',
                params: [
                    'String IndexedList AssociativeList',
                    'String Field',
                    'String IdField',
                    'String ValueField',
                    'String Entity',
                ],
                docs: 'Copy multiple items from a list into a field or variable.',
                syntax: `vList = "NAME=Frodo ; $LOC_TOT$=14 ; $$GLOB_TOT=329 ; $1=-8"
getlistitems/id vList`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/getlistitems_xdu1665702560072.html',
            },
            {
                name: 'goto',
                params: ['String Label'],
                docs: 'Branch unconditionally to the specified label.',
                syntax: `operation exec
    $1 = 0
    retrieve
start:
    if ($1 = 1001)
        store
        exit
    else
        remocc
        $1 = $1 + 1
    endif
    goto start
end ; exec`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/goto_agv1665703005070.html',
            },
            {
                name: 'help',
                params: [
                    'String Topic',
                    'String LogicalName',
                    'String Keyword',
                    'String HelpMessage',
                    'String VertPos , HorizPos , VertSize , and HorizSize',
                ],
                docs: 'Display help information, either a Uniface help message or information from the native help system.',
                syntax: `trigger help
    help/topic " ", "myhelp"
    if ($status < 0)
        message "Unable to show help index: %%$status"
    endif
end ; help`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/help_cfj1665702607852.html',
            },
            {
                name: 'if',
                params: ['Boolean Condition'],
                docs: 'Define an if/endif conditional block.',
                syntax: 'if ( Condition 1 ) ... one or more ProcScript statements ... { elseif ( Condition 2 ) ... one or more ProcScript statements ... elseif ( Condition n ) ... one or more ProcScript statements ... } { else ... one or more ProcScript statements ... } endif',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/if_hoe1665702578676.html',
            },
            {
                name: 'jsonToStruct',
                params: ['struct or any StructTarget', 'string JsonSource'],
                docs: 'Convert a JSON text to a Struct.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/jsontostruct_uob1665702567324.html',
            },
            {
                name: 'javascript',
                params: [],
                docs: 'Declares a JavaScript block in a client-side trigger or operation.',
                syntax: `weboperation AlertJS
scope
    input
    output
endscope
javascript
    alert("THIS IS JAVASCRIPT CODING");
endjavascript
end ; AlertJS`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/javascript_gst1665703005142.html',
            },
            {
                name: 'ldircreate',
                params: ['String NewDirPath'],
                docs: 'Create the specified directory in the working directory, ignoring redirections in the assignment file.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/ldircreate_cst1665702570102_2.html',
            },
            {
                name: 'ldirdelete',
                params: ['String DirPath'],
                docs: 'Delete the specified directory, ignoring any redirections in the assignment file.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/ldirdelete_wpo1665702570394_2.html',
            },
            {
                name: 'ldirrename',
                params: ['String DirPath', 'String NewDirName'],
                docs: 'Rename the specified directory, ignoring redirections in the assignment file.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/ldirrename_evz1665702570697.html',
            },
            {
                name: 'length',
                params: [],
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/length_deprecated__hxd1665702606673.html',
                deprecated: true,
            },
            {
                name: 'lfilecopy',
                params: ['String FilePath', 'String DirPath', 'String NewFilePath'],
                docs: 'Copy a local file to a local location. File locations specified in the assignment file are ignored.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lfilecopy_bis1665702571366.html',
            },
            {
                name: 'lfiledelete',
                params: ['String FilePath'],
                docs: 'Delete the specified file, ignoring file redirections in the assignment file.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lfiledelete_dja1665702571611.html',
            },
            {
                name: 'lfiledump',
                params: [
                    'String Source',
                    'String FileName',
                    'String UnicodeFormat',
                    'String CharSet',
                ],
                docs: 'Copy the contents of the source object to the specified file on the local file system, ignoring file redirections that might occur in the assignment file.',
                syntax: 'lfiledump { /text { /nobom } { /append } | /image | /raw | /web } Source, FileName { , UnicodeFormat | CharacterSet }',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lfiledump_qot1665702571691.html',
            },
            {
                name: 'lfileload',
                params: [
                    'String FilePath',
                    'String Target',
                    'String UnicodeFormat',
                    'String CharSet',
                ],
                docs: 'Copy the contents of a file into a field or variable, ignoring any file redirections in the assignment file.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lfileload_cnw1665702572057.html',
            },
            {
                name: 'lfilemove',
                params: ['String FilePath', 'String DirPath', 'String NewFilePath'],
                docs: 'Move a local file to a local directory, ignoring any file redirections in the assignment file.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lfilemove_uow1665702572236.html',
            },
            {
                name: 'lfilerename',
                params: ['String FilePath', 'String NewFileName'],
                docs: 'Rename a file in the same directory, ignoring any file redirections in the assignment file.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lfilerename_oyn1665702570922.html',
            },
            {
                name: 'lflush',
                params: ['String ZipArchive', 'String XmlFile'],
                docs: 'Complete a file management transaction for the specified open zip archive or XML file, then close the file, ignoring any file redirections in the assignment file.',
                syntax: 'lfiledump "abc", "b5.zip:dir1/def.txt" lflush "b5.zip:"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lflush_fvu1665702572458.html',
            },
            {
                name: 'lock',
                params: [],
                docs: 'Lock the current occurrence in the database.',
                syntax: `trigger lock
    lock
    if ($status = -10)
        reload
    endif
end ; lock`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lock_mks1665703005217.html',
            },
            {
                name: 'lookup',
                params: [],
                docs: 'Count the number of occurrences that match the current profile.',
                syntax: `trigger loseFocus
    lookup
    if ($status > 0)
        message "No! This number has been used before!"
        return (-1)
    else
        message "I/O error %%$status"
    endif
end ; loseFocus`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lookup_ebm1665702598309.html',
            },
            {
                name: 'lowercase',
                params: [],
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/lowercase_deprecated__rnc1665703005296.html',
                deprecated: true,
            },
            {
                name: 'macro',
                params: ['String RequestCodes'],
                docs: 'Place the specified structure editor request in the event input queue of a form component.',
                syntax: `trigger startModification
    macro "^127^005" ; ^RETRIEVE
end ; startModification`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/macro_yas1665702606127.html',
            },
            {
                name: 'message',
                params: ['String MessageText'],
                docs: 'Display the specified string in the message line (if it is available), or an interactive dialog box.',
                syntax: '[info] This is my message.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/message_ubi1665702607312.html',
            },
            {
                name: 'moveocc',
                params: ['String Entity', 'Number OccurrenceNumber', 'String FieldList'],
                docs: 'Move the field values of the current occurrence to another occurrence.',
                syntax: `operation uupdate
params
    occurrence pEntity : IN
endparams

findkey pEntity
moveocc pEntity, $result, $fields$
end ; uupdate`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/moveocc_byy1665703005368.html',
            },
            {
                name: 'newinstance',
                params: [
                    'String ComponentName',
                    'String Handle',
                    'String InstanceName',
                    'String InstanceProperties',
                ],
                docs: 'Creates a new instance of a component.',
                syntax: 'err=-25: Problems handling request err=-25: Server gone',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/newinstance_ryt1665702577808.html',
            },
            {
                name: 'nodebug',
                params: [],
                docs: 'Return focus to the application. For the character mode Debugger, stop the Debugger.',
                syntax: `operation exec
    debug
    edit
    nodebug
end ; exec`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/nodebug_hzl1665703003956.html',
            },
            {
                name: 'numgen',
                params: ['String CounterName', 'Number Increment', 'String LibName'],
                docs: 'Increment the value of the specified counter.',
                syntax: `operation exec
    numgen "INVOICE_NUMBER", 1, "COUNTER_LIB"
    if ($status < 0)
        message "Error generating sequence number."
        rollback "$UUU"
        edit SEQNO
        done
    else
        SEQNO = $result
        commit "$UUU"
        edit NAME
    endif
end ; exec`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/numgen_nlv1665703005447.html',
            },
            {
                name: 'numset',
                params: ['String CounterName', 'Number InitialValue', 'String LibraryName'],
                docs: 'Initialize the value of the specified counter.',
                syntax: `trigger detail
    numset "NUMBERCOUNTER", 0, "SALES_LIBRARY"
    commit "$UUU"
    message "Counter %%NUMBERCOUNTER in SALES_LIBRARY set to 0."
end ; detail`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/numset_mbq1665703005578.html',
            },
            {
                name: 'open',
                params: [
                    'String LogonParameters',
                    'String Name',
                    'String UserName',
                    'String Password',
                    'String UST',
                    'String PathName',
                    '/net',
                ],
                docs: 'Open the specified DBMS or path, or connect to the Uniface Router.',
                syntax: 'open "|scott|tiger", "$ora"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/open_soa1665702524341.html',
            },
            {
                name: 'operation',
                params: [
                    'Literal OperationName',
                    'Literal PredefinedOperationName',
                    'Literal ScopeBlock',
                    'Literal ParamsBlock',
                    'Literal VariablesBlock',
                ],
                docs: 'Declare an operation ProcScript module.',
                syntax: `operation DISCOUNT
params
    string CUSTID : IN
    numeric AMOUNT : INOUT
    numeric PERCENTAGE : OUT
endparams

PERCENTAGE = 0
if (CUSTID == "ufbv")
    PERCENTAGE = 20
elseif (CUSTID == "acme")
    PERCENTAGE = 15
endif
AMOUNT = AMOUNT * (100 - PERCENTAGE) / 100
end ; DISCOUNT`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/operation_kek1665703005651.html',
            },
            { name: 'params', params: [] },
            {
                name: 'postmessage',
                params: [
                    'String Destination',
                    'String MessageId',
                    'String MessageData',
                    'String InstancePath',
                    'String InstanceName',
                    'String NetworkMnemonic',
                    'String HostId',
                    'String PortNumber',
                    'String UserName',
                    'String SymbolicName',
                ],
                docs: 'Send a message from one component instance to another.',
                syntax: `trigger receiveMessage
    postmessage $msginfo("SRC"), "MSG001", %/
        "Reply to sender: message received."
end ; receiveMessage`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/postmessage_wtd1665702577667.html',
            },
            {
                name: 'proccompile',
                params: ['String ProcScript', 'ContextList'],
                docs: 'Compile a piece of ProcScript at runtime, as an expression or condition.',
                syntax: 'AMOUNT>100',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/proccompile_cbb1665703005736.html',
            },
            {
                name: 'partner',
                params: [],
                docs: 'Modifies a declaration to indicate that the declared operation or handle cannot be called or used by another component. In combination with the web keyword, it prevents the operation or trigger of a Dynamic Server Page from being directly invoked',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/partner_kbj1665702595703.html',
            },
            {
                name: 'print',
                params: ['String PrintJobModel', 'String PrintMode', 'String USE_SYSTEM_SETTINGS'],
                docs: 'Activate printing.',
                syntax: 'print/ask "SALESLASER","A"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/print_xtn1665702606752.html',
            },
            {
                name: 'printbreak',
                params: ['String BreakFrameName'],
                docs: 'Print the specified break frame.',
                syntax: `trigger leavePrinted
    compare (DATE) from "INVOICE"
    if ($result = 0)
        if ($lines < 5)
            eject
        endif
        DATE.DAYTOT = DATE.INVOICE
        printbreak "DAYTOT"
        AMOUNT.DAYTOT = 0
        if ($lines < 10)
            eject
        endif
    endif
    return (0)
end ; leavePrinted`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/printbreak_mqg1665702688475.html',
            },
            {
                name: 'public',
                params: [],
                docs: 'Modifies a declaration to indicate that the declared operation or handle is available for external use and can be called or used by another component.',
                syntax: 'public operation getAccounts ... end',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/public_shx1665702583127.html',
            },
            {
                name: 'pulldown',
                params: ['String MenuBar'],
                docs: 'Activate or load the specified menu bar.',
                syntax: `operation exec
    pulldown/load "P_USYS"
    edit NAME_FIELD
end ; exec`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/pulldown_kyz1665702608722.html',
            },
            {
                name: 'putitem',
                params: [
                    'String IndexedList AssociativeList',
                    'Number Index',
                    'String ItemId',
                    'String ItemValue',
                ],
                docs: 'Add or replace an item in a list.',
                syntax: '$valrep(DBMSFLD) = "rms ; ora ; syb ; db2"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/putitem_ndm1665702662916.html',
            },
            {
                name: 'putlistitems',
                params: [
                    'String IndexedList AssociativeList',
                    'String Source',
                    'String Field IdField ValueField',
                    'String Entity',
                ],
                docs: 'Copy data from a group of fields or variables into a list.',
                syntax: `setocc "CALENDAR", 1
putlistitems vItem, DAY.CALENDAR
; vItem is "Monday ; Tuesday ; Wednesday".`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/putlistitems_lpk1665702708140.html',
            },
            {
                name: 'putmess',
                params: ['String MessageText'],
                docs: 'Append text to the message frame.',
                syntax: `operation exec
    CUSTNAME.CUSTOMER = $1
    COUNTRY.CUSTOMER = $2
    retrieve
    if ($status < 0)
        putmess "Retrieve problem. No printout."
        apexit
    else
        print "SALESLASER", "A"
        putmess "Printout sent to LaserJet II"
    endif
end ; exec`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/putmess_ubo1665702607631.html',
            },
            {
                name: 'read',
                params: [
                    'Number Index',
                    'Number n',
                    'String SelectionCriteria',
                    'String DMLSelectionCriteria',
                    'String Condition',
                    'String OrderBySpecs',
                ],
                docs: 'Fetch an occurrence from the hitlist.',
                syntax: 'trigger read read if ($status == 0) ; Populate non-DB field POSTAL_ADDRES: POSTAL_ADDRES.ENT = $concat(STREET.ENT, "%%^", CITY.ENT) endif end;',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/read_hcs1665703005814.html',
            },
            {
                name: 'reconnect',
                params: ['String EntityName'],
                docs: 'Reconnect data loaded from a disconnected record set (XML, JSON, or Struct) with the occurrences in a component and database (if connected).',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/reconnect_qnx1665702574893.html',
            },
            {
                name: 'refresh',
                params: [],
                docs: 'Redraw the current Form component in character mode only.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/refresh_whl1665702772305.html',
            },
            {
                name: 'release',
                params: ['String Entity'],
                docs: 'Release database controls.',
                syntax: `trigger clear
    if ($formdb = 1)
        release
        message "Control released; data available as default"
    else
        clear
    endif
    return (0)
end ; clear`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/release_oom1665702598230.html',
            },
            {
                name: 'reload',
                params: [],
                docs: 'Reread and lock the current occurrence from the database.',
                syntax: 'trigger lock lock if ($status = -10) reload endif end; lock',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/reload_xpg1665702707055.html',
            },
            {
                name: 'remocc',
                params: ['String Entity', 'Number OccurrenceNumber'],
                docs: 'Mark an occurrence of the specified entity for deletion at the next store.',
                syntax: `trigger leaveModified
    if (INVAMOUNT <= 0)
        remocc "CUSTOMER", 0
        message "Customer with no debt removed."
    endif
end ; leaveModified`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/remocc_fpg1665702560533.html',
            },
            {
                name: 'repeat',
                params: ['Boolean Condition'],
                docs: 'Define a repeat/until loop.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/repeat_unf1665702578355.html',
            },
            {
                name: 'reset',
                params: ['Literal ProcScriptFunction'],
                docs: 'Reset the value of the specified ProcScript function to 0.',
                syntax: 'operation exec city = "New Orleans" ; this sets $formmod to 1 reset $formmod edit NAME end',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/reset_ukk1665702596834.html',
            },
            {
                name: 'rethrow',
                params: [],
                docs: 'Rethrows an exception that was caught in a catch block.',
                syntax: `function my_function throws
    try
        ; Code that might raise system or custom exceptions.
    catch -2, -4, -10050
        ; Handle expected I/O and custom errors.
    catch
        if ($procerror >= -150 & $procerror < -200)
            rethrow
        endif
    endtry
end ; my_function`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/rethrow_bzp1665702760995.html',
            },
            {
                name: 'retrieve',
                params: ['String Entity'],
                docs: 'Activate the read trigger for the first outermost entity and all related entities, or for a specific entity.',
                syntax: `; Read trigger of ENT1.
; ENT1 is a modeled non-database outer entity.
; ENT2 is a modeled database inner entity.
read
retrieve/e "ENT2"`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/retrieve_cyd1665702599286.html',
            },
            {
                name: 'retrieve/a',
                params: ['String Entity'],
                docs: 'Retrieve multiple additional occurrences of the specified entity without discarding the hitlist.',
                syntax: `clear
PK = 1
retrieve

creocc
PK = ">10"
retrieve/a`,
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/retrieve_a_qbv1665702599441.html',
            },
            {
                name: 'retrieve/o',
                params: ['String Entity'],
                docs: 'Attempt to locate an occurrence of an entity using the current primary key value.',
                syntax: 'retrieve/o if ($status < 0) if ($status=-15) message $text(2202);Multiple hits: in foreign entity if ($status=-14) message $text(2205);Multiple hits: not in foreign entity if ($status=-11) message $text(2009);Occurrence currently locked if ($status=-7) message $text(2006);Duplicate key if ($status=-4) message $text(2003);Cannot open table or file if ($status=-3) message $text(2002);Exceptional I/O error if ($status=-2) message $text(2200);Key not found:in foreign entity else if ($status=1) message $text(2201);Key not found:foreign entity w/WRITE UP if ($status=2);One occurrence found in foreign entity retrieve/e if ($status < 0) message $text(2002);I/O error detected endif if ($status=3) message $text(2203);Occurrence un-removed if ($status=4) message $text(2204);Key found:occurrence repositioned endif return ($status)',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/retrieve_o_kld1665702599590.html',
            },
            {
                name: 'retrieve/reconnect',
                params: ['String EntityName'],
                docs: 'Reconnect data loaded from a disconnected record set (XML, JSON, or Struct) with the occurrences in a database or component.',
                syntax: 'operation XMLIN ; This operation receives and ; reconnects an XML stream. params xmlstream [DTD:ABCDTD.ABC] MYSTREAM : IN endparams clear xmlload MYSTREAM, "DTD:ABCDTD.ABC" retrieve/reconnect ...',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/retrieve_reconnect_thr1665702690548.html',
            },
            {
                name: 'retrieve/x',
                params: ['String Entity'],
                docs: 'Retrieve an additional occurrence of the specified entity without discarding the hitlist.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/retrieve_x_ltv1665702599361.html',
            },
            {
                name: 'return',
                params: ['Any Expression'],
                docs: 'Exit from the ProcScript module, optionally returning a value to $status.',
                syntax: 'trigger quit ; check for modifications: if no changes ; end and set $status = 0 ; return -1 prevents user from leaving form if ($formmod = 0) return else askmess "Data modified! Do you want to store? (Y/N)" if ($status = 1) store if ($status < 0) message "Store error number %%$status%%%" return (-1) endif else return (0) ;leave form without storing endif endif end ; quit',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/return_ckg1665702579864.html',
            },
            {
                name: 'returns',
                params: ['String DataType'],
                docs: 'Define the returned data type of a function or entry.',
                syntax: 'function multiply returns numeric params numeric parm1 : IN numeric parm2 : IN endparams variables numeric vMultiplyResult endvariables vMultiplyResult = parm1 * parm2 return vMultiplyResult end ; multiply',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/returns_eva1665702625026.html',
            },
            {
                name: 'rollback',
                params: ['String PathString'],
                docs: 'Undo the transaction (if supported by DBMS).',
                syntax: 'trigger store store if ($status < 0) message "Store error number %%$status." rollback else message "Store done." commit endif end; store',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/rollback_csi1665702634389.html',
            },
            {
                name: 'run',
                params: [
                    'String FormDefinition',
                    'String VerticalPosition , HorizontalPosition , VerticalSize and HorizontalSize',
                ],
                docs: 'Starts the specified Form.',
                syntax: 'run "c:/t_forms/qry1.frm"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/run_deprecated__qiy1665703006046.html',
                deprecated: true,
            },
            {
                name: 'scan',
                params: [],
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/scan_deprecated__hsn1665702783399.html',
                deprecated: true,
            },
            { name: 'scope', params: [] },
            {
                name: 'selectcase',
                params: ['String MatchExpression , Expression'],
                docs: 'Define a block of conditional case selections.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/selectcase_bdw1665702578600.html',
            },
            {
                name: 'selectdb',
                params: [
                    'Literal LitFieldName',
                    'String Function',
                    'String Entity',
                    'Number Index',
                    'String SelectionCriteria',
                    'String Condition',
                    'String Destination',
                ],
                docs: 'Calculate aggregate values for specified fields in the database.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/selectdb_ubp1665702661359.html',
            },
            {
                name: 'set',
                params: ['Literal ProcScriptFunction'],
                docs: 'Set the value of the specified ProcScript function to 1 (TRUE).',
                syntax: 'operation exec ; set $occcheck to TRUE to enable checking name = $1 retrieve set $occcheck(INVOICE) edit NAME end; exec',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/set_qfg1665702596984.html',
            },
            {
                name: 'setocc',
                params: ['String Entity', 'Number OccurrenceNumber'],
                docs: 'Make a specific occurrence the current occurrence.',
                syntax: 'operation exec ; fetch all occurrences into component retrieve setocc "CUSTOMER",-1 message "Last customer is %%custnumber%%%." edit end; exec',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/setocc_vhw1665702560221.html',
            },
            {
                name: 'setformfocus',
                params: ['String InstanceName'],
                docs: 'Set the focus to the specified component instance.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/setformfocus_tod1665702665614.html',
            },
            {
                name: 'show',
                params: [],
                docs: 'Display or refresh a form component, synchronizing the display and updating field and property values.',
                syntax: 'function CountDown() variables numeric j endvariables MyField.MyEnt = 10 while (MyField.MyEnt > 0) show j = 10000 while (j>0) j = j - 1 endwhile MyField.MyEnt = MyField.MyEnt - 1 endwhile',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/show_qgc1665702595858.html',
            },
            {
                name: 'skip',
                params: ['String Expression'],
                docs: 'Skip the specified number of lines when printing.',
                syntax: 'trigger leavePrinted ; $printing checks if printing is in process if ($printing = 1) compare/next (INVDATE) from "INVOICE" if ($result = 0) skip 2 endif endif end; leavePrinted',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/skip_zdt1665702751625.html',
            },
            {
                name: 'sleep',
                params: ['Number Ticks'],
                docs: 'Set the current Uniface process in sleep mode for the specified amount of time.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/sleep_zpr1665703006120.html',
            },
            {
                name: 'soap',
                params: [],
                docs: 'Declares that the operation can be activated by a SOAP request.',
                syntax: 'operation SOAP_UPDATE public soap ;- declare accessible via SOAP channel params endparams <... do something ...> end',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/soap_znh1665702582685.html',
            },
            {
                name: 'sort',
                params: ['String Entity', 'String FieldName', 'String SortCriteria'],
                docs: 'Sort the occurrences in the hitlist for the specified entity.',
                syntax: 'retrieve/e "PERSON.ORG" putitem/id vFields, "FAMILY_NAME:a" putitem/id vFields, "FIRST_NAME:a" sort "PERSON.ORG", vFields',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/sort_jei1665702553041.html',
            },
            {
                name: 'sort/list',
                params: ['String List', 'String SortElement', 'String SortOptions'],
                docs: 'Sort an associative list, an indexed list, or an indexed list of sub-lists.',
                syntax: 'vColors = "" putitem/id vColors "0", "BLUE" putitem/id vColors "1", "RED" putitem/id vColors "2", "GREEN"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/sort_list_kes1665702553734.html',
            },
            {
                name: 'spawn',
                params: ['String OSCommand'],
                docs: 'Pass the specified command to the operating system.',
                syntax: '; start conv_val to convert file specified in vFile spawn "#conv_val.exe %%vFile.raw" ; load processed values into vValues fileload "%%$1.dat",vValues',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/spawn_rtx1665702772229.html',
            },
            {
                name: 'sql',
                params: ['String DMLStatement', 'String PathString'],
                docs: 'Pass a DML statement to the specified DBMS path.',
                syntax: 'trigger loseFocus if ($fieldendmod != 0) sql "select invnum from invoices where invnum = \'%%invnum%%%\'","ora" if ($status > 0) message "Number already in use!" return (-1) endif endif end ;loseFocus',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/sql_fvo1665702607150.html',
            },
            {
                name: 'store',
                params: ['String Entity'],
                docs: 'Initiate validation and storage of all occurrences marked as modified. It activates the appropriate validation triggers as required, followed by the write and delete triggers.',
                syntax: 'trigger detail retrieve setocc "DEPT", 4 store/e/complete "DEPT" commit macro "^LAST_OCC" end; detail',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/store_kgi1665702560769.html',
            },
            {
                name: 'stripattributes',
                params: [],
                docs: 'Remove character attributes, frames, and rulers from Source and put the result in Target.',
                syntax: 'MYFIELD = "aaabbb" stripattributes MYFIELD, EDITBOX ; EDITBOX contains "aaabbb" and the value of $status is 1.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/stripattributes_fgf1665702617809.html',
            },
            {
                name: 'structToComponent',
                params: ['Struct StructSource'],
                docs: 'Converts data from a Struct or collection of Structs into the entities and occurrences in the component.',
                syntax: 'Context=StructToComponent ; Warnings=2 ; DETAILS= ID=-1161 !!; SEVERITY=Warning !!; MNEM=<STRUCTERR_NO_MATCHING_NAME> !!; DESCRIPTION=No matching name found during conversion from struct !!; CURRENTSTRUCT=ORDER->OCC{1}->ORDER_I{1} !!; ADDITIONAL= SPECIFIEDNAME=ORDER_I !!!; EXPECTEDTYPE=entity or field !; ID=-1160 !!; SEVERITY=Warning !!; MNEM=<STRUCTERR_TAGVALUE_NOT_APPLICABLE> !!; DESCRIPTION=Struct tag value not applicable in conversion from struct !!; CURRENTSTRUCT=ORDER->OCC{1}->SHIP_TO{1} !!; ADDITIONAL= TAGNAME=u_type !!!; TAGVALUE=component !!!; EXPECTEDTYPE=entity or field',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/structtocomponent_lln1665702574971.html',
            },
            {
                name: 'structToJson',
                params: ['string JsonTarget', 'struct or any StructSource'],
                docs: 'Convert a Struct to a JSON text, as an object or an array.',
                syntax: '{"My JSON text":[1,{"color":"blue"}]}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/structtojson_xwl1665702567400.html',
            },
            {
                name: 'structToXml',
                params: ['xmlstream XmlTarget', 'struct StructSource'],
                docs: 'Convert a Struct to XML, without a schema.',
                syntax: '[] [movie] = "The Matrix" $tags xmlClass = "element" [p] = "The Matrix is a great movie." $tags xmlClass = "element" [p] = "It is much better than its sequels." $tags xmlClass = "element"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/structtoxml_kwk1665702698713.html',
            },
            {
                name: 'structToXml/schema',
                params: [
                    'xmlstream , string , or any XmlTarget',
                    'struct or any StructSource',
                    'String Schema',
                    'String StartingPoint',
                ],
                docs: 'Convert a Struct to XML using a schema.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/structtoxml_schema_yyu1665702700014.html',
            },
            { name: 'to', params: [] },
            {
                name: 'throw',
                params: [
                    'Numeric ErrorNumber',
                    'String Description',
                    'String AdditionalInformation',
                ],
                docs: 'Throw an exception.',
                syntax: 'public operation loadOrder throws params string pOrderId : IN endparams if (pOrderId == "") throw -10001, "Invalid input parameter", "PARAM_INDEX=1;PARAM_NAME=pOrderId;EXPECTED_VALUE=Not NULL" endif ID.ORDER/init = pOrderId retrieve/e "ORDER" end try retrieve throw -10054, "Description", "more context list" catch -2, -4, -10054 ; code to handle the expected exceptions endtry',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/throw_ccf1665702761572.html',
            },
            {
                name: 'throw/list',
                params: ['String ExceptionInfo'],
                docs: 'Throw an exception with exception information provided as a Uniface list.',
                syntax: 'throw/list prepare_exception(...)',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/throw_list_sly1665702761643.html',
            },
            {
                name: 'throws',
                params: [],
                docs: 'Declares that any runtime error ($procerror) that occurs in the module will be regarded as an exception.',
                syntax: 'operation doSomething throws ; Operation doSomething can raise exceptions ; Code that could set $procerror to a negative value. <your code here> end',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/throws_wnu1665702760924.html',
            },
            { name: 'trigger', params: [] },
            {
                name: 'try',
                params: [],
                docs: 'A try block specifies a ProcScript instruction, or set of instructions, that could raise an exception.',
                syntax: 'try <ProcScript that may throw an exception> {catch} {ErrorNumber1 {, ErrorNumberN}} <Procscript that handles the error >} {rethrow} {finally} <ProcScript that will always execute, regardless of whether an error occurred or not> endtry',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/try_sal1665702761072.html',
            },
            {
                name: 'u_condition',
                params: ['String SelectionExpression'],
                docs: 'Provide a DBMS-independent profile for selection in read and selectdb statements.',
                syntax: 'u_condition (SelectionExpression',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/u_condition_gmx1665702661506.html',
            },
            {
                name: 'undeclare',
                params: ['String ModuleType', 'String ModuleName'],
                docs: 'Force the specified ProcScript module to be ignored during compilation.',
                syntax: 'undeclare ModuleType ModuleName',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/undeclare_dik1665702666914.html',
            },
            {
                name: 'until',
                params: [],
                docs: 'Clause in a repeat statement that must evaluate to TRUE before the repeat loop can complete.',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/until_axb1665703006200.html',
            },
            {
                name: 'uppercase',
                params: [],
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/uppercase_deprecated__zbh1665703006270.html',
                deprecated: true,
            },
            {
                name: 'u_where',
                params: [],
                docs: 'Provide a DBMS-independent profile for selection with read and selectdb.',
                syntax: 'u_where (SelectionCriteria)',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/u_where_ffb1665702661430.html',
            },
            {
                name: 'validate',
                params: [],
                docs: 'Validate all data marked as modified.',
                syntax: 'validate validate/e {Entity} validate/o {Entity} Example: validate/e "CUSTOMER"',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/validate_tvk1665703006345.html',
            },
            {
                name: 'validatefield',
                params: ['String Field'],
                docs: 'Validate a field of the current occurrence.',
                syntax: 'validatefield Field',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/validatefield_jwi1665702576586.html',
            },
            {
                name: 'validatekey',
                params: ['Entity', 'KeyNumber'],
                docs: 'Validate a key of the current occurrence.',
                syntax: 'validatekey Entity {,KeyNumber}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/validatekey_fdp1665702576817.html',
            },
            {
                name: 'validateocc',
                params: ['Entity'],
                docs: 'Validate an occurrence.',
                syntax: 'validateocc {Entity}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/validateocc_bwv1665702576896.html',
            },
            { name: 'variables', params: [] },
            {
                name: 'web',
                params: [],
                docs: 'Declares that the trigger or operation can be called from a web client, or that its data can be included in the DSP request-response exchange of other triggers or operations.',
                syntax: 'public web { | partner web }',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/web_zbc1665702583540.html',
            },
            {
                name: 'webactivate',
                params: ['String InstanceName', 'String OperationName', 'String Parameters'],
                docs: 'Sends an instruction to the browser to invoke an operation.',
                syntax: 'webactivate InstanceName{.OperationName {(Parameters) } }',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/webactivate_ocl1665702595428.html',
            },
            {
                name: 'webgen',
                params: ['String LayoutFile', 'String OutputFile'],
                docs: 'Generate an XHTML document from the layout definition and the component definition of a static server page.',
                syntax: 'webgen{/append} {LayoutFile} {,OutputFile}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/webgen_gna1665702540285.html',
            },
            {
                name: 'webget',
                params: [],
                docs: 'Load data from a client request into a static server page (USP), reconnect to the database if applicable, set a current occurrence, and activate a detail or error trigger, if required.',
                syntax: 'webget',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/webget_jfa1665702540666.html',
            },
            {
                name: 'webdefinitions',
                params: [],
                docs: 'Use the current component to load channels in $webinfo.',
                syntax: 'webdefinitions',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/webdefinitions_mez1665702540201.html',
            },
            {
                name: 'weblayout',
                params: ['String FileName'],
                docs: 'Copies the layout of the dynamic server page instance and prepares to send it to the browser.',
                syntax: 'weblayout {FileName}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/weblayout_fpa1665702539028.html',
            },
            {
                name: 'webload',
                params: [],
                docs: 'Loads data from a JSON stream in $webinfo("data") into a component.',
                syntax: 'webload',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/webload_wro1665702574572.html',
            },
            {
                name: 'webmessage',
                params: ['String Message', 'String PropertyList'],
                docs: 'Displays a message in a dialog box in the browser.',
                syntax: 'webmessage/info | /warning | /error Message {, PropertyList}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/webmessage_llj1665702684093.html',
            },
            { name: 'weboperation', params: [] },
            {
                name: 'websave',
                params: [],
                docs: 'Writes a JSON stream from the data in a component to $webinfo("data").',
                syntax: 'websave{/mod | /one}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/websave_idq1665702567079.html',
            },
            {
                name: 'websetocc',
                params: [],
                docs: 'Sets the current occurrence according to the information received from the DSP client.',
                syntax: 'websetocc',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/websetocc_pfj1665702684183.html',
            },
            {
                name: 'webtrigger',
                params: [],
                docs: 'Define a trigger in a DSP that will be executed on the client browser.',
                syntax: 'webtrigger WidgetTriggerName {ScopeBlock} {ParamsBlock} {JavaScriptBlock} end',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/webtrigger_ldg1665702595527.html',
            },
            {
                name: 'while',
                params: ['Boolean Condition'],
                docs: 'Define a while/endwhile loop.',
                syntax: 'while ( Condition) ... one or more ProcScript statements ... endwhile',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/while_kfr1665702578830.html',
            },
            {
                name: 'write',
                params: [],
                docs: 'Write the current occurrence to the database.',
                syntax: 'write',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/write_nht1665702561308.html',
            },
            {
                name: 'xmlload',
                params: ['String XmlSource', 'String DTDName', 'String DTDMappaing'],
                docs: 'Load data from an XML stream into occurrences drawn on the component.',
                syntax: 'xmlload{/incldefmap}{/noprofile} XmlSource,DTDName {,DTDMapping}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/xmlload_vuu1665702574732.html',
            },
            {
                name: 'xmlsave',
                params: ['String XmlTarget', 'String DTDName', 'String DTDMapping'],
                docs: 'Places component data in an XML stream.',
                syntax: 'xmlsave{/mod}{/one}{/dtd | /ref}{/incldefmap}{/root} XmlTarget,DTDname {,DTDmapping}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/xmlsave_ebq1665702566280.html',
            },
            {
                name: 'xmlvalidate',
                params: ['String XMLStream', 'String ValidationData'],
                docs: 'Validate an XML stream.',
                syntax: 'xmlvalidate{/file} XMLStream {,ValidationData}',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/xmlvalidate_jgs1665702758516.html',
            },
            {
                name: 'xmlToStruct',
                params: ['struct or any StructTarget', 'String XmlDocument', 'String SchemaList'],
                docs: 'Convert an XML document to a Struct.',
                syntax: 'xmlToStruct {/full} {/whitespace} StructTarget, XmlDocument xmlToStruct {/full} {/validate } { /schema} StructTarget, XmlDocument, SchemaList',
                link: 'https://docs.rocketsoftware.com/pt-BR/bundle/uniface2_104/page/topics/xmltostruct_svz1665702699008.html',
            },
        ].map((statement) => ({
            ...statement,
            link: toOfficialDocumentationLink(statement.link),
        }));
    }
}
