PennController.ResetPrefix(null)

Header(
    newVar("ID").global(),
    newVar("score",[]).global()
).log( "PP_ID" , getVar("ID"))

Sequence("intro","instructions","practice","pagebreak");

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

newTrial("instructions", 
	newHtml("instruction_page","instructions.html")
		.cssContainer({"margin-bottom":"1em"})
		.print()
	,
	newButton("start_training","Alıştırmayı başlat")
	.cssContainer({"margin-bottom":"2.5em"})
        .print()
        .wait()
);

Template("practice_trials.csv" , row =>
    newTrial("practice",
        newText("key_bindings", "1 = Mavi&nbsp;&nbsp;&nbsp; 2 = Yeşil&nbsp;&nbsp;&nbsp;3 = Sarı")
            .bold()
			.cssContainer({"vertical-align":"top"})
            .print()
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
        newText("positivefeedback","Doğru!")
        ,
        newText("negativefeedback","Yanlış!")
        ,
        getTimer("allotted_practice")
            .wait()
        ,
        getKey("prac_key")
            .test.pressed(row.correctKey)
            .success(
                getVar("score").set(v=>[...v,true]),
                getText("positivefeedback")
                    .center()
                    .print())
            
            .failure(getVar("score").set(v=>[...v,false]),
                getText("negativefeedback")
                    .center()
                    .print())
        ,
        newTimer("post-trial",1000).start().wait()
));


newTrial("pagebreak",
    newVar("computed_accuracy").set(getVar("score")).set(v=>Math.round(v.filter(a=>a===true).length/v.length*100),
    newText("accuracy").text(getVar("computed_accuracy")),
    newText("Alıştırma doğruluk oranı: ")
        .after(getText("accuracy"))
        .print()
    ,
    newText("<h3> Alıştırma aşamasını tamamladınız. Eğer tuşların yerini öğrendiyseniz şimdi gerçek test başlayacak.<h3>")
        .center()
        .print()
    ,
    newButton("wait","Çalışmayı başlat")
        .center()
        .print()
        .cssContainer({"margin-bottom":"2.5em"})
        .wait()
));




Template("stroop_trials.csv" , row =>
    newTrial("mainexp",
        newTimer("pre-trial", 500).start().wait()
        ,
		newVar("RT").global().set(v=>Date.now())
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
		,
		getVar("RT").set(v=>Date.now()-v)
    )
    .log( "accuracy" , getVar("correct"))
	.log("RT", getVar("RT")
    .log( "condition", row.Condition)
)); 
