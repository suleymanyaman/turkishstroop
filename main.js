PennController.ResetPrefix(null)

Header(
    newVar("ID").global()
).log( "PP_ID" , getVar("ID"))

Sequence("practice", "mainexp");

newTrial("intro",
    defaultText
        .cssContainer({"margin-bottom":"1em","margin-top":"1em"})
        .print()
    ,
    newText("instruction","Enter your participant ID:").print()
    ,
    newTextInput("ppid")
        .print()
    ,
    newButton("continue","Continue")
        .cssContainer({"margin-top":"1em","margin-bottom":"2.5em"})
        .print()
        .wait()
    ,
    getVar("ID").set(getTextInput("ppid"))
);


newTrial("pagebreak",
    newText("<h3>Alıştırma aşamasını tamamladınız. Şimdi gerçek test başlayacak.<h3>")
        .center()
        .print()
    ,
    newButton("wait","Çalışmayı başlat")
        .center()
        .print()
        .cssContainer({"margin-bottom":"2.5em"})
        .wait()
)


Template("practice_trials.csv" , row =>
    newTrial("practice",
        newText("key_bindings", "1 = Mavi&nbsp;&nbsp;&nbsp; 2 = Yeşil&nbsp;&nbsp;&nbsp;3 = Sarı")
            .bold()
            .print()
        ,
        newVar("correct_practice").global()
        ,
        newTimer("pre-trial", 500).start().wait()
        ,
        newText("target_practice", row.Word)
            .color(row.FontColor)
            .center()
            .css('font-style','Arial')
            .css('font-weight','bold')
            .css('font-size','32px')
            .print()
        ,
        newTimer("allotted_practice", 2000).start()
        ,
        newKey("prac_key","123")
            .log()
            .callback(getTimer("allotted_practice").stop())
        
        ,
        newText("positivefeedback","Correct!")
        ,
        newText("negativefeedback","Wrong!")
        ,
        getTimer("allotted_practice")
            .wait()
        ,
        getKey("prac_key")
            .test.pressed(row.CorrectKey)
            .success( 
                getText("positivefeedback")
                    .center()
                    .print() )
            
            .failure(
                getText("negativefeedback")
                    .center()
                    .print())
        ,
        newTimer("post-trial",1000).start().wait()
));






Template("stroop_trials.csv" , row =>
    newTrial("mainexp",
        newVar("correct").global()
        ,
        newTimer("pre-trial", 500).start().wait()
        ,
        newText("target", row.Word)
            .color(row.FontColor)
            .center()
            .css('font-size','4em')
            .print()
        ,
        newTimer("allotted_time", 2000).start()
        ,
        newKey("key_presssed","123")
            .log()
            .callback(getTimer("allotted_time").stop())
        ,
        getTimer("allotted_time")
            .wait()
        ,
        getKey("key_presssed")
            .test.pressed(row.CorrectKey)
            .success(
                getVar("correct").set(1) )
            
            .failure( 
                getVar("correct").set(0)
                )
    )
    .log( "accuracy" , getVar("correct"))
    .log( "condition", row.Condition)
); 
