export const statementSyntaxByName: Readonly<Record<string, string>> = {
    activate:
        'activate {/list | /sync | /async} | { /stateless} InstName{.LitOperationName ( {ArgumentList} ) }',
    addmonths: 'addmonths Months, Date {,ReferenceDate}',
    apexit: 'apexit',
    apstart: 'apstart',
    askmess:
        'askmess {/nobeep} {/question | /info | /warning | /error} "MessageText{~MessageTitle}" {,Replies}',
    blockdata: 'BlockName: blockdata Delimiter ... ... text ... ... Delimiter',
    break: 'break',
    call: 'call {Library::}LitFunctionName { ( ArgumentList ) }',
    catch: 'try <ProcScript that may throw an exception> {catch} {ErrorNumber1 {,ErrorNumberN}} <Procscript that handles the error > endtry',
    clear: 'clear{/e Entity}',
    close: 'close {"PathName/net"}',
    clrmess: 'clrmess',
    colorbox: 'colorbox {/hex | /rgb} {/full} {"Color"}',
    commit: 'commit {"PathString"}',
    compare: 'compare{/previous | /next} (FieldList) {from Entity}',
    componentToStruct:
        'componentToStruct {/mod} {/one} {/reconnecttags} {/firetriggers} StructTarget {, EntityName}',
    creocc: 'creocc Entity, OccurrenceNumber',
    curoccvideo: 'curoccvideo/inner "MyOuterEntity", "BRI"',
    debug: `trigger exec
    debug
    edit
end ; exec`,
    delete: `trigger delete
    delete
end ; delete`,
    deleteinstance: `trigger apStart
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
    delitem: '$1 = ""',
    dircreate: 'dircreate "coffee"',
    dirdelete: `$dir$ = "drinks/tea/"

if ($dirlist($dir$, "dir") = "" & $dirlist($dir$, "file") = "")
    askmess/warning "Do you want to delete '%%$dir$'?", "Yes, No"
    if ($status = 1)
        ldirdelete $dir$
    else
        message/error "Directory '%%$dir$' is not empty!"
    endif
endif`,
    dirrename: 'dirrename "drinks/coffee/", "tea"',
    discard:
        'function discardtest clear/e "ENT1" retrieve/e "ENT1" setocc "ENT1",1 repeat selectcase P1.ENT1 case "1" setocc "ENT1", $curocc(ENT1) + 1 case "10" setocc "ENT1", $curocc(ENT1) + 1 elsecase discard endselectcase until ($status <=0) end',
    display: `operation exec
    CUST_NBR = $1
    retrieve
    message "%%$hits customers match search profile"
    display CUSTNAME
end ; exec`,
    done: `trigger quit
    if ($formmod = 0)
        done
    else
        message "Data modified!! Use STORE before QUIT."
        return (-1)
    endif
end ; quit`,
    edit: `operation exec
    CUST_NBR = $1
    retrieve
    message "Selected customer ready for editing."
    edit CUSTNAME
end ; exec`,
    eject: `trigger leavePrinted
    compare/next (INVDATE) from "INVOICE"
    ; Start a new page when the next invoice has a different date.
    if ($result = 0)
        eject
    endif
end`,
    end: `trigger store
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
    endtry: 'try <ProcScript that may throw an exception> {catch} {ErrorNumber1 {, ErrorNumberN}} <Procscript that handles the error >} {rethrow} {finally} <ProcScript that will always execute, regardless of whether an error occurred or not> endtry',
    entitycopy: `; Copy data from a database to XML.
entitycopy "def:myent.mymodel", "xml:myexportfile.xml"
entitycopy "def:myent.mymodel", "xml:myzip.zip:myexportfile.xml"

; Copy data from XML to a database.
entitycopy "xml:myexportfile.xml", "def:myent.mymodel"`,
    entry: `entry doSomething returns string
    return ("I did something")
end`,
    erase: 'trigger erase ; of component if ($totocc(CUSTOMER) >= 1) askmess "%%$totocc(CUSTOMER) occurrences. Erase them all?" if ($status = 0) return endif endif erase if ($status <0) message "Erase error; see message frame" rollback else if ($status = 1) message "Erase is not allowed" else message "Erase was successful" commit if($status < 0) rollback endif endif endif end ; erase',
    exit: `trigger accept
    $1 = CUSTNAME
    exit (1)
end ; accept`,
    filebox: 'filebox "*.xml"',
    filecopy: 'filecopy "sub1dir/test.txt", "sub1dir/sub2dir/"',
    filedelete: 'filedelete "sub1dir/test.txt"',
    filedump:
        'filedump { /text { /nobom } { /append } | /image | /raw | /web } Source, FileName { , UnicodeFormat | CharacterSet }',
    fileload:
        'fileload { /text | /raw | /image | /web } FilePath, Target { , UnicodeFormat | CharSet }',
    filemove: 'filemove "sub1dir/test.txt", "sub1dir/sub2dir/"',
    filerename: 'filerename "sub1dir/test.txt", "tested.txt"',
    finally:
        'try <ProcScript that might throw an exception> catch { Error1 { , ErrorN }} <ProcScript that will execute for the specified Error(s)> finally <ProcScript that will always execute, regardless of whether an error occurred or not> endtry',
    findkey: 'findkey $entname, 1',
    flush: 'filedump "abc", "C:/Uniface/Uniface96_Data/project/b5.zip:dir1/def.txt" flush "C:/Uniface/Uniface96_Data/project/b5.zip:"',
    getitem: `$valrep(DBMSFLD) = "mss ; ora ; syb ; db2"
getitem vItem, $valrep(DBMSFLD), 3
; vItem contains "syb".`,
    getlistitems: `vList = "NAME=Frodo ; $LOC_TOT$=14 ; $$GLOB_TOT=329 ; $1=-8"
getlistitems/id vList`,
    goto: `operation exec
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
    help: `trigger help
    help/topic " ", "myhelp"
    if ($status < 0)
        message "Unable to show help index: %%$status"
    endif
end ; help`,
    if: 'if ( Condition 1 ) ... one or more ProcScript statements ... { elseif ( Condition 2 ) ... one or more ProcScript statements ... elseif ( Condition n ) ... one or more ProcScript statements ... } { else ... one or more ProcScript statements ... } endif',
    javascript: `weboperation AlertJS
scope
    input
    output
endscope
javascript
    alert("THIS IS JAVASCRIPT CODING");
endjavascript
end ; AlertJS`,
    lfiledump:
        'lfiledump { /text { /nobom } { /append } | /image | /raw | /web } Source, FileName { , UnicodeFormat | CharacterSet }',
    lflush: 'lfiledump "abc", "b5.zip:dir1/def.txt" lflush "b5.zip:"',
    lock: `trigger lock
    lock
    if ($status = -10)
        reload
    endif
end ; lock`,
    lookup: `trigger loseFocus
    lookup
    if ($status > 0)
        message "No! This number has been used before!"
        return (-1)
    else
        message "I/O error %%$status"
    endif
end ; loseFocus`,
    macro: `trigger startModification
    macro "^127^005" ; ^RETRIEVE
end ; startModification`,
    message: '[info] This is my message.',
    moveocc: `operation uupdate
params
    occurrence pEntity : IN
endparams

findkey pEntity
moveocc pEntity, $result, $fields$
end ; uupdate`,
    newinstance: 'err=-25: Problems handling request err=-25: Server gone',
    nodebug: `operation exec
    debug
    edit
    nodebug
end ; exec`,
    numgen: `operation exec
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
    numset: `trigger detail
    numset "NUMBERCOUNTER", 0, "SALES_LIBRARY"
    commit "$UUU"
    message "Counter %%NUMBERCOUNTER in SALES_LIBRARY set to 0."
end ; detail`,
    open: 'open "|scott|tiger", "$ora"',
    operation: `operation DISCOUNT
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
    postmessage: `trigger receiveMessage
    postmessage $msginfo("SRC"), "MSG001", %/
        "Reply to sender: message received."
end ; receiveMessage`,
    proccompile: 'AMOUNT>100',
    print: 'print/ask "SALESLASER","A"',
    printbreak: `trigger leavePrinted
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
    public: 'public operation getAccounts ... end',
    pulldown: `operation exec
    pulldown/load "P_USYS"
    edit NAME_FIELD
end ; exec`,
    putitem: '$valrep(DBMSFLD) = "rms ; ora ; syb ; db2"',
    putlistitems: `setocc "CALENDAR", 1
putlistitems vItem, DAY.CALENDAR
; vItem is "Monday ; Tuesday ; Wednesday".`,
    putmess: `operation exec
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
    read: 'trigger read read if ($status == 0) ; Populate non-DB field POSTAL_ADDRES: POSTAL_ADDRES.ENT = $concat(STREET.ENT, "%%^", CITY.ENT) endif end;',
    release: `trigger clear
    if ($formdb = 1)
        release
        message "Control released; data available as default"
    else
        clear
    endif
    return (0)
end ; clear`,
    reload: 'trigger lock lock if ($status = -10) reload endif end; lock',
    remocc: `trigger leaveModified
    if (INVAMOUNT <= 0)
        remocc "CUSTOMER", 0
        message "Customer with no debt removed."
    endif
end ; leaveModified`,
    reset: 'operation exec city = "New Orleans" ; this sets $formmod to 1 reset $formmod edit NAME end',
    rethrow: `function my_function throws
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
    retrieve: `; Read trigger of ENT1.
; ENT1 is a modeled non-database outer entity.
; ENT2 is a modeled database inner entity.
read
retrieve/e "ENT2"`,
    'retrieve/a': `clear
PK = 1
retrieve

creocc
PK = ">10"
retrieve/a`,
    'retrieve/o':
        'retrieve/o if ($status < 0) if ($status=-15) message $text(2202);Multiple hits: in foreign entity if ($status=-14) message $text(2205);Multiple hits: not in foreign entity if ($status=-11) message $text(2009);Occurrence currently locked if ($status=-7) message $text(2006);Duplicate key if ($status=-4) message $text(2003);Cannot open table or file if ($status=-3) message $text(2002);Exceptional I/O error if ($status=-2) message $text(2200);Key not found:in foreign entity else if ($status=1) message $text(2201);Key not found:foreign entity w/WRITE UP if ($status=2);One occurrence found in foreign entity retrieve/e if ($status < 0) message $text(2002);I/O error detected endif if ($status=3) message $text(2203);Occurrence un-removed if ($status=4) message $text(2204);Key found:occurrence repositioned endif return ($status)',
    'retrieve/reconnect':
        'operation XMLIN ; This operation receives and ; reconnects an XML stream. params xmlstream [DTD:ABCDTD.ABC] MYSTREAM : IN endparams clear xmlload MYSTREAM, "DTD:ABCDTD.ABC" retrieve/reconnect ...',
    return: 'trigger quit ; check for modifications: if no changes ; end and set $status = 0 ; return -1 prevents user from leaving form if ($formmod = 0) return else askmess "Data modified! Do you want to store? (Y/N)" if ($status = 1) store if ($status < 0) message "Store error number %%$status%%%" return (-1) endif else return (0) ;leave form without storing endif endif end ; quit',
    returns:
        'function multiply returns numeric params numeric parm1 : IN numeric parm2 : IN endparams variables numeric vMultiplyResult endvariables vMultiplyResult = parm1 * parm2 return vMultiplyResult end ; multiply',
    rollback:
        'trigger store store if ($status < 0) message "Store error number %%$status." rollback else message "Store done." commit endif end; store',
    run: 'run "c:/t_forms/qry1.frm"',
    set: 'operation exec ; set $occcheck to TRUE to enable checking name = $1 retrieve set $occcheck(INVOICE) edit NAME end; exec',
    setocc: 'operation exec ; fetch all occurrences into component retrieve setocc "CUSTOMER",-1 message "Last customer is %%custnumber%%%." edit end; exec',
    show: 'function CountDown() variables numeric j endvariables MyField.MyEnt = 10 while (MyField.MyEnt > 0) show j = 10000 while (j>0) j = j - 1 endwhile MyField.MyEnt = MyField.MyEnt - 1 endwhile',
    skip: 'trigger leavePrinted ; $printing checks if printing is in process if ($printing = 1) compare/next (INVDATE) from "INVOICE" if ($result = 0) skip 2 endif endif end; leavePrinted',
    soap: 'operation SOAP_UPDATE public soap ;- declare accessible via SOAP channel params endparams <... do something ...> end',
    sort: 'retrieve/e "PERSON.ORG" putitem/id vFields, "FAMILY_NAME:a" putitem/id vFields, "FIRST_NAME:a" sort "PERSON.ORG", vFields',
    'sort/list':
        'vColors = "" putitem/id vColors "0", "BLUE" putitem/id vColors "1", "RED" putitem/id vColors "2", "GREEN"',
    spawn: '; start conv_val to convert file specified in vFile spawn "#conv_val.exe %%vFile.raw" ; load processed values into vValues fileload "%%$1.dat",vValues',
    sql: 'trigger loseFocus if ($fieldendmod != 0) sql "select invnum from invoices where invnum = \'%%invnum%%%\'","ora" if ($status > 0) message "Number already in use!" return (-1) endif endif end ;loseFocus',
    store: 'trigger detail retrieve setocc "DEPT", 4 store/e/complete "DEPT" commit macro "^LAST_OCC" end; detail',
    stripattributes:
        'MYFIELD = "aaabbb" stripattributes MYFIELD, EDITBOX ; EDITBOX contains "aaabbb" and the value of $status is 1.',
    structToComponent:
        'Context=StructToComponent ; Warnings=2 ; DETAILS= ID=-1161 !!; SEVERITY=Warning !!; MNEM=<STRUCTERR_NO_MATCHING_NAME> !!; DESCRIPTION=No matching name found during conversion from struct !!; CURRENTSTRUCT=ORDER->OCC{1}->ORDER_I{1} !!; ADDITIONAL= SPECIFIEDNAME=ORDER_I !!!; EXPECTEDTYPE=entity or field !; ID=-1160 !!; SEVERITY=Warning !!; MNEM=<STRUCTERR_TAGVALUE_NOT_APPLICABLE> !!; DESCRIPTION=Struct tag value not applicable in conversion from struct !!; CURRENTSTRUCT=ORDER->OCC{1}->SHIP_TO{1} !!; ADDITIONAL= TAGNAME=u_type !!!; TAGVALUE=component !!!; EXPECTEDTYPE=entity or field',
    structToJson: '{"My JSON text":[1,{"color":"blue"}]}',
    structToXml:
        '[] [movie] = "The Matrix" $tags xmlClass = "element" [p] = "The Matrix is a great movie." $tags xmlClass = "element" [p] = "It is much better than its sequels." $tags xmlClass = "element"',
    throw: 'public operation loadOrder throws params string pOrderId : IN endparams if (pOrderId == "") throw -10001, "Invalid input parameter", "PARAM_INDEX=1;PARAM_NAME=pOrderId;EXPECTED_VALUE=Not NULL" endif ID.ORDER/init = pOrderId retrieve/e "ORDER" end try retrieve throw -10054, "Description", "more context list" catch -2, -4, -10054 ; code to handle the expected exceptions endtry',
    'throw/list': 'throw/list prepare_exception(...)',
    throws: 'operation doSomething throws ; Operation doSomething can raise exceptions ; Code that could set $procerror to a negative value. <your code here> end',
    try: 'try <ProcScript that may throw an exception> {catch} {ErrorNumber1 {, ErrorNumberN}} <Procscript that handles the error >} {rethrow} {finally} <ProcScript that will always execute, regardless of whether an error occurred or not> endtry',
    u_condition: 'u_condition (SelectionExpression',
    undeclare: 'undeclare ModuleType ModuleName',
    u_where: 'u_where (SelectionCriteria)',
    validate: 'validate validate/e {Entity} validate/o {Entity} Example: validate/e "CUSTOMER"',
    validatefield: 'validatefield Field',
    validatekey: 'validatekey Entity {,KeyNumber}',
    validateocc: 'validateocc {Entity}',
    web: 'public web { | partner web }',
    webactivate: 'webactivate InstanceName{.OperationName {(Parameters) } }',
    webgen: 'webgen{/append} {LayoutFile} {,OutputFile}',
    webget: 'webget',
    webdefinitions: 'webdefinitions',
    weblayout: 'weblayout {FileName}',
    webload: 'webload',
    webmessage: 'webmessage/info | /warning | /error Message {, PropertyList}',
    websave: 'websave{/mod | /one}',
    websetocc: 'websetocc',
    webtrigger: 'webtrigger WidgetTriggerName {ScopeBlock} {ParamsBlock} {JavaScriptBlock} end',
    while: 'while ( Condition) ... one or more ProcScript statements ... endwhile',
    write: 'write',
    xmlload: 'xmlload{/incldefmap}{/noprofile} XmlSource,DTDName {,DTDMapping}',
    xmlsave: 'xmlsave{/mod}{/one}{/dtd | /ref}{/incldefmap}{/root} XmlTarget,DTDname {,DTDmapping}',
    xmlvalidate: 'xmlvalidate{/file} XMLStream {,ValidationData}',
    xmlToStruct:
        'xmlToStruct {/full} {/whitespace} StructTarget, XmlDocument xmlToStruct {/full} {/validate } { /schema} StructTarget, XmlDocument, SchemaList',
};
