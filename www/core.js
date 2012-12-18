document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    //disable logging
    (function(){
     console.log = function (message) {
     };
     })();
    
    
    window.loadedblog=0;
    window.currentID='stage_0';
    window.smsTo='81190';
    window.smsBody='PIRATEN';
    window.twitterActive=1;
    /*window.plugins.twitter.isTwitterAvailable(function(r){
     console.log("twitter available? " + r);
     window.plugins.twitter.isTwitterSetup(function (r) {
     console.log("twitter configured? " + r);
     window.twitterActive=r;
     if(r!=1) {
     $('#twitter').hide();
     }
     });
     }); */
    setTimeout(function() {
               navigator.splashscreen.hide();
               $("#progress").fadeOut();
               $("#progressrss").fadeOut();
               $("#progressnearby").fadeOut();
               }, 2000);
}
function padZero(s){
    c= '0';
    len=2;
    while(s.length < len) s= c + s;
    return s;
}
function ajaxErr(xhr, errortext) {
    $("#progressnearby").fadeOut();
    $("#progressrss").fadeOut();
    $("#progressrss").fadeOut();
    if(errortext=="timeout") {
        navigator.notification.alert('Beim der Anfrage ist eine Zeitüberschreitung aufgetreten. Bitte Interverbindung überprüfen und erneut versuchen.', function(buttonIndex) {},
                                     'Laden...',
                                     'OK'
                                     );
    } else {
        navigator.notification.alert('Ein unbekannter Fehler ist aufgetreten. Bitte Interverbindung überprüfen und erneut versuchen.', function(buttonIndex) {},
                                     'Laden...',
                                     'OK'
                                     );
    }
}
function shareNow(media){
    if(media==1) {
        window.plugins.twitter.composeTweet(
                                            function(s){
                                            console.log("tweet success");
                                            },
                                            function(e){
                                            console.log("tweet failure: " + e);
                                            },
                                            window.shareText,
                                            {
                                            urlAttach:window.shareUrl
                                            });
    } else {
        console.log('http://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.shareUrl)+'&t='+encodeURIComponent(window.shareText));
        window.location.href='http://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.shareUrl)+'&t='+encodeURIComponent(window.shareText);
    }
}
function share(text, url, media) {
    window.shareText=text;
    window.shareUrl=url;
    if(media!=1 && media!=2 ) {
        navigator.notification.alert(
                                     "Wo teilen?",
                                     function(buttonIndex) {
                                     if (buttonIndex == 1) {
                                     shareNow(1);
                                     } else if (buttonIndex == 2) {
                                     shareNow(2);
                                     }
                                     },
                                     "Teilen",
                                     "Twitter, Facebook"
                                     )
    } else {
        shareNow(media);
    }
    
}
var my_media = null;
var mediaTimer = null;
function playAudio(src) {
    console.log(src);
    my_media = new Media(src, onSuccess, onError);
    my_media.play();
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
                                 my_media.getCurrentPosition(
                                                             function(position) {
                                                             if (position > -1) {
                                                             $("#progress").fadeOut();
                                                             dur = my_media.getDuration();
                                                             minVard = Math.floor(dur/60);
                                                             secVard = dur % 60;
                                                             minVarp = Math.floor(position/60);
                                                             secVarp = position % 60;
                                                             secVarps =Math.floor(secVarp).toString();
                                                             secVards =Math.floor(secVard).toString();
                                                             c= '0';
                                                             len=2;
                                                             while(secVarps.length < len) secVarps= c + secVarps;
                                                             while(secVards.length < len) secVards= c + secVards;
                                                             setAudioPosition((minVarp) + ":" + secVarps + "/" + (minVard) + ":" + secVards);
                                                             }
                                                             },
                                                             function(e) {
                                                             console.log("Error getting pos=" + e);
                                                             setAudioPosition("Error: " + e);
                                                             }
                                                             
                                                             );
                                 }, 1000);
    }
}

function unpauseAudio(src) {
    console.log(src);
    my_media.play();
    
}
function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
    
}
function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}
function onSuccess() {
    /*            var thistrack=parseInt($('#thisTrack').val());
     console.log(thistrack);
     liclick.call($('.stage_3_2_2 li').eq((thistrack+1)));
     playAudio('http://pp90.de/idkpmedia/chap_'+(thistrack+1)+'.mp3');
     $(".stage li").eq((thistrack+1)).each(function() {
     $('#thisTrack').val((thistrack+1));
     var title=$(this).children('a').text();
     $("#currentTitle").html(title);
     $("#progress").fadeIn(function() {
     console.log(thistrack)
     });
     });
     */        }
function onError(error) {
    console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    $("#progress").hide();
    navigator.notification.alert(
                                 'Laden der Datei fehlgeschlagen! Bitte Internetverbindung überprüfen!',
                                 function(bi) {
                                 console.log(bi);
                                 },
                                 "Fehler",
                                 "Ok"
                                 );
}
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}
function parseRSS(url, callback) {
    console.log(url);
    $.ajax({
           url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
           dataType: 'json',
           timeout: '5000',
           success: function(data) {
           callback(data.responseData.feed);
           },
           error: ajaxErr
           });
}
function showResponse(jsondata)  {
    console.log(jsondata);
    if(jsondata.success==1) {
        $('#lastschrift').resetForm();
        if(window.twitterActive==1) {
            var dialogText="Vielen Dank für deine Spende in Höhe von "+jsondata.betrag+"€! Möchtest du das vielleicht teilen?";
            var buttonText="Teilen!,Nein";
            var butT=1;
            var butNT=2;
        } else {
            var dialogText="Vielen Dank für deine Spende in Höhe von "+jsondata.betrag+"€!";
            var buttonText="Gerne!";
            var butT=99;
            var butNT=1;
        }
        navigator.notification.alert(dialogText,
                                     function(buttonIndex) {
                                     if (buttonIndex == butNT) {
                                     headclick.call($('.stage_0 span'));
                                     } else if (buttonIndex == butT) {
                                     share("Ich hab grade "+jsondata.betrag+" € an die @PiratenNDS gespendet! #ltwnds13 #ideenkopierer","http://spenden.piraten-nds.de/spenden/");
                                     headclick.call($('.stage_0 span'));
                                     } else if (buttonIndex == 1) {
                                     window.plugins.smsComposer.showSMSComposerWithCB(smsres,window.smsTo, window.smsBody);
                                     }
                                     },
                                     "Spende erfolgreich",
                                     buttonText
                                     );
        
    } else {
        if(jsondata.error=="email") {
            navigator.notification.alert("Leider kann deine Spende gerade nicht entgegengenommen werden. Bitte versuch es später noch einmal!",
                                         function(bi) {
                                         console.log(bi);
                                         },
                                         "Spende fehlgeschlagen",
                                         "Ok!"
                                         );
        } else if(jsondata.error=="entry") {
            var errors=jsondata.fields.join(",");
            navigator.notification.alert("In den Feldern: "+errors+" hast du keinen oder einen nicht zulässigen Wert eingegeben. Überprüfe bitte deine Eingabe!",
                                         function(bi) {
                                         console.log(bi);
                                         },
                                         "Spende fehlgeschlagen",
                                         "Ok!"
                                         );
        }
    }
}
function showRequest(formData, jqForm, options) {
    
    return false;
}

function submiterr(e) {
    navigator.notification.alert(
                                 "Das Absenden der Spende ist fehlgeschlagen. Bitte Internetverbindung prüfen!",
                                 function(bi) {console.log(bi);},
                                 "Fehler",
                                 "Ok"
                                 );
}
function submiterrInfo(e) {
    navigator.notification.alert(
                                 "Das Absenden deiner Bestellung ist fehlgeschlagen. Bitte Internetverbindung prüfen!",
                                 function(bi) {console.log(bi);},
                                 "Fehler",
                                 "Ok"
                                 );
}
function showResponseInfo(jsondata)  {
    console.log(jsondata);
    if(jsondata.success==1) {
        $('#infomat').resetForm();
        setTimeout(function() {
                   navigator.notification.alert(
                                                "Das Infomaterial wird schnellstmöglich an dich gesendet! Die Versendung kostet uns ca."+jsondata.betrag+" €. Wir möchten dich daher bitten, mindestens diesen Betrag zu spenden.",
                                                function(buttonIndex) {
                                                if (buttonIndex == 1) {
                                                headclick.call($('#c39 span'));
                                                } else if (buttonIndex == 2) {
                                                headclick.call($('#c40 span'));
                                                } else if (buttonIndex == 3) {
                                                headclick.call($('.stage_0 span'));
                                                }
                                                },
                                                "Bestellung erfolgreich",
                                                "Spenden via Handyrechnung,Spenden via Lastschrift,Nicht Spenden"
                                                );
                   
                   },100);
    } else {
        if(jsondata.error=="email") {
            navigator.notification.alert(
                                         "Leider kann deine Spende gerade nicht entgegengenommen werden. Bitte versuch es später noch einmal!",
                                         function(bi) {console.log(bi);},
                                         "Spende fehlgeschlagen",
                                         "Ok!"
                                         );
        } else if(jsondata.error=="entry") {
            var errors=jsondata.fields.join(",");
            navigator.notification.alert(
                                         "In den Feldern: "+errors+" hast du keinen oder einen nicht zulässigen Wert eingegeben. Überprüfe bitte deine Eingabe!",
                                         function(bi) {console.log(bi);},
                                         "Spende fehlgeschlagen",
                                         "Ok!"
                                         );
        }
    }
}
$(document).ready(function() {
                  $('#lastschrift').submit(function() {
                                           navigator.notification.alert(
                                                                        "Mit dem Klick auf die OK-Schalftlfäche erteilen Sie der Piratenpartei Niedersachsen die Erlaubnis, von dem angegebenen Konto den angegebenen Betrag als Spende abzubuchen. Diese Erklärung gilt bis auf Weiteres. Ein jederzeit möglicher Widerruf erfolgt in Textform.",
                                                                        function(buttonIndex) {
                                                                        if (buttonIndex == 1) {
                                                                        $('#lastschrift').ajaxSubmit({dataType:  'json',error:submiterr, success: showResponse});
                                                                        }
                                                                        },
                                                                        "Einzugsermächtigung",
                                                                        "Ok,Abbrechen"
                                                                        );
                                           return false;
                                           });
                  $('#infomat').ajaxForm({dataType:  'json',success: showResponseInfo,error:submiterrInfo});
                  $('.panel').height(window.innerHeight-270);
                  window.headclick = function() {
                  stopAudio();
                  var btnclass=$(this).parent().attr('class').split(/\s+/);
                  var oldstageclass=$(this).parent().parent().attr('class').split(/\s+/);
                  if(oldstageclass[0]=='stage_0') {
                  var newstage='stage_1';
                  } else {
                  var oldstage=oldstageclass[0].split('_');
                  var index=$(this).parent().index();
                  var newstage='stage_'+(parseInt(oldstage[1])+1)+'_';
                  
                  
                  for (var i=1;i<(oldstage.length-1);i++)
                  {
                  newstage+=oldstage[(i+1)]+'_';
                  }
                  
                  
                  newstage+=+(index+1);
                  if(btnclass[1]=='last') {
                  stopAudio();
                  newstage='stage_'+(oldstage[1]-1);
                  for (var i=2;i<(oldstage.length);i++)
                  {
                  newstage+='_'+(oldstage[i]);
                  }
                  newstage=newstage.substring(0, newstage.length - 2)
                  if(newstage.charAt((newstage.length-1))=="_") {
                  newstage=newstage.substring(0, newstage.length - 1)
                  }
                  }
                  }
                  console.log(oldstageclass[0]);
                  console.log(newstage);
                  if(newstage=='stage_3_1_3') {
                  CDVVideo.play('http://pp90.de/idkpmedia/wahlwerbespot_mittel1.mp4', 'YES');
                  } else {
                  $('.stage').not('.'+newstage).fadeOut(function() {
                                                        $('.'+newstage).fadeIn();
                                                        window.currentID=newstage;
                                                        });
                  }
                  }
                  $('.contentPreHead span,.contentPreHead div').click(headclick);
                  window.liclick= function() {
                  console.log('bla');
                  var index=$(this).index();
                  var stage=$(this).parent().parent().attr('class').split(/\s+/);
                  var oldstage=stage[0].split('_');
                  var newstage='stage_'+(parseInt(oldstage[1])+1)+'_';
                  
                  
                  for (var i=1;i<(oldstage.length-1);i++)
                  {
                  newstage+=oldstage[(i+1)]+'_';
                  }
                  
                  
                  newstage+=+(index+1);
                  console.log(newstage);
                  
                  
                  if((newstage.indexOf('stage_4_2_2_'))!=-1) {
                  $('#thisTrack').val(index);
                  var title=$(this).children('a').text();
                  $("#currentTitle").html(title);
                  $("#progress").fadeIn(function() {
                                        window.currentID=newstage;
                                        $(newstage).fadeIn();
                                        playAudio('http://pp90.de/idkpmedia/chap_'+index+'.mp3');
                                        });
                  }
                  
                  
                  $('.stage').not('.'+newstage).fadeOut(function() {
                                                        window.currentID=newstage;
                                                        $('.'+newstage).fadeIn();
                                                        });
                  }
                  $(".stage li").click(liclick);
                  $("#c5").click(function() {
                                 $('#player').fadeOut(function() {
                                                      stopAudio();
                                                      $('.nav').fadeIn();
                                                      });
                                 });$("#plakate img").click(function() {
                                                            $('#ovel').fadeIn();
                                                            var src=$(this).attr('src');
                                                            $('#plakatimg').attr('src',src);
                                                            });
                  
                  $("#ovel").click(function() {
                                   $('#ovel').fadeOut();
                                   var src=$(this).attr('src');
                                   $('#plakatimg').attr('src',src);
                                   });
                  
                  
                  
                  $("#playbtn").click(function() {
                                      var src=$(this).children('img').attr('src');
                                      if(src=='images/media-playback-pause-5.ico') {
                                      $("#pauseimg").attr('src','images/media-playback-start-5.ico');
                                      pauseAudio();
                                      } else {
                                      $("#pauseimg").attr('src','images/media-playback-pause-5.ico');
                                      unpauseAudio();
                                      }
                                      });
                  $("#stopbtn").click(function() {
                                      stopAudio();
                                      $("#pauseimg").attr('src','images/media-playback-start-5.ico');
                                      });
                  $("#c71").click(function() {
                                  window.location.href='http://www.twitter.com/ideenkopierer';
                                  });
                  $("#c72").click(function() {
                                  window.location.href='http://www.twitter.com/PiratenNDS';
                                  });
                  $("#c73").click(function() {
                                  window.location.href='http://www.facebook.com/PiratenNDS';
                                  });
                  $("#c74").click(function() {
                                  window.location.href='http://www.facebook.com/ideenkopierer';
                                  });
                  $("#c41").click(function() {
                                  window.plugins.smsComposer.showSMSComposerWithCB(smsres,window.smsTo, window.smsBody);
                                  });
                  function smsres(result){
                  setTimeout(function(){
                             if(result == 0){
                             navigator.notification.alert(
                                                          "Schade, dass du nicht gespendet hast. Möchtest du vielleicht lieber per Lastschrift spenden?",
                                                          function(buttonIndex) {
                                                          if (buttonIndex == 1) {
                                                          headclick.call($('#c40 span'));
                                                          } else if (buttonIndex == 2) {
                                                          headclick.call($('.stage_0 span'));
                                                          }
                                                          },
                                                          "Spende abgebrochen",
                                                          "Ja gerne!,Nein"
                                                          );
                             
                             }
                             else if(result == 1){
                             if(window.twitterActive==1) {
                             var dialogText="Vielen Dank für deine Spende! Möchtest du das vielleicht teilen, oder sogar noch mal spenden?";
                             var buttonText="Noch mal!,Teilen!,Nein";
                             var butT=2;
                             var butNT=3;
                             } else {
                             var dialogText="Vielen Dank für deine Spende! Möchtest du noch mal spenden?";
                             var buttonText="Ja, noch mal spenden!,Nein";
                             var butT=99;
                             var butNT=2;
                             }
                             navigator.notification.alert(
                                                          dialogText,
                                                          function(buttonIndex) {
                                                          if (buttonIndex == butNT) {
                                                          headclick.call($('.stage_0 span'));
                                                          } else if (buttonIndex == butT) {
                                                          share("Ich hab grade 5 € an die @PiratenNDS gespendet! #ltwnds13 #ideenkopierer","http://spenden.piraten-nds.de/spenden/");
                                                          headclick.call($('.stage_0 span'));
                                                          } else if (buttonIndex == 1) {
                                                          window.plugins.smsComposer.showSMSComposerWithCB(smsres,window.smsTo, window.smsBody);
                                                          }
                                                          },
                                                          "Spende erfolgreich",
                                                          buttonText
                                                          );
                             }
                             else if(result == 2)
                             alert("Failed.");
                             else if(result == 3)
                             alert("Not Sent.");
                             },100);
                  }
                  $("#c33").click(function() {
                                  if(window.loadedblog!=1) {
                                  $("#progressrss").fadeIn(function() {
                                                           parseRSS('http://wahl.piraten-nds.de/category/blog/feed/',function(e) {
                                                                    window.loadedblog=1;
                                                                    $("#progressrss").fadeOut();
                                                                    console.log(e);
                                                                    var html = '';
                                                                    var html2=''
                                                                    for (var i = 0; i < e.entries.length; i++) {
                                                                    console.log(e.entries[i]);
                                                                    html += '<li>    <a href="#">' + e.entries[i].title + '</a></li>';
                                                                    html2 +='<div class="stage_4_4_4_'+(i+1)+' stage subp panel blogtext" id=""><div class="contentPreHead last" id="c5"><span>Wahl-Blog</span></div><p class="blog_title">'+e.entries[i].title+'</p><p class="blog_author">'+e.entries[i].author+'</p><p>'+e.entries[i].content+'</p></div>';
                                                                    }
                                                                    $('#blog').html(html);
                                                                    $('#blogcontainer').html(html2);
                                                                    $(".stage li").click(liclick);
                                                                    $('.contentPreHead span').click(headclick);
                                                                    $(".blogtext a").attr('target','_blank');
                                                                    $('.panel').height(window.innerHeight-270);
                                                                    });
                                                           });
                                  }
                                  });
                  window.linkrel=new Object();
                  linkrel['stage_0']='http://ideenkopierer.de';
                  linkrel['stage_1']='http://ideenkopierer.de';
                  linkrel['stage_2_1']='http://ideenkopierer.de/werbung/';
                  linkrel['stage_2_2']='http://ideenkopierer.de/programm/';
                  linkrel['stage_2_3']='http://reisebuero.piraten-nds.de/';
                  linkrel['stage_3_1_1']='http://ideenkopierer.de/werbung/';
                  linkrel['stage_3_1_2']='http://ideenkopierer.de/werbung/plakate/';
                  linkrel['stage_3_4_1']='http://wahl.piraten-nds.de/listenkandidaten/';
                  linkrel['stage_3_2_1']='http://www.piraten-nds.de/programm';
                  linkrel['stage_3_2_2']='http://www.piraten-nds.de/programm';
                  linkrel['stage_3_4_3']='http://spenden.piraten-nds.de/spenden/';
                  linkrel['stage_3_4_4']='http://wahl.piraten-nds.de/';
                  linkrel['stage_3_3_4']='http://www.piraten-nds.de/';
                  linkrel['stage_4_4_3_3']='https://spenden.piraten-nds.de/spenden/sms-spende/';
                  linkrel['stage_4_4_3_4']='https://spenden.piraten-nds.de/spenden/lastschrift/';
                  
                  window.linkdesc=new Object();
                  linkdesc['stage_0']='Ideenkopierer.de';
                  linkdesc['stage_1']='Ideenkopierer.de';
                  linkdesc['stage_2_1']='Ideenkopierer.de > Werbung';
                  linkdesc['stage_2_2']='Ideenkopierer.de > Programm';
                  linkdesc['stage_2_3']='Reisebüro';
                  linkdesc['stage_3_1_1']='Ideenkopierer.de > Werbung';
                  linkdesc['stage_3_1_2']='Ideenkopierer.de > Plakate';
                  linkdesc['stage_3_4_1']='Wahlportal > Listenkandidaten';
                  linkdesc['stage_3_2_1']='Wahlportal > Wahlprogramm';
                  linkdesc['stage_3_2_2']='Wahlportal > Wahlprogramm';
                  linkdesc['stage_3_4_3']='Spendenportal';
                  linkdesc['stage_3_4_4']='Wahlportal';
                  linkdesc['stage_3_3_4']='piraten-nds.de';
                  linkdesc['stage_4_4_3_3']='Spendenportal > SMS-Spende';
                  linkdesc['stage_4_4_3_4']='Spendenportal > Lastschrift';
                  $("#twitter").click(function() {
                                      
                                      if(linkrel[window.currentID]==undefined) {
                                      var addurl='http://ideenkopierer.de';
                                      var addesc='Ideenkopierer.de';
                                      } else {
                                      var addurl=linkrel[window.currentID];
                                      var addesc=linkdesc[window.currentID];
                                      }
                                      navigator.notification.alert(
                                                                   "Möchtest du in deinem Tweet auf die Seite "+addesc+" verweisen?",
                                                                   function(buttonIndex) {
                                                                   if (buttonIndex == 2) {
                                                                   addurl=undefined;
                                                                   }
                                                                   
                                                                   share("#ltwnds13 #ideenkopierer",addurl, 1);
                                                                   },
                                                                   "Twittern",
                                                                   "Ja,Nein"
                                                                   );
                                      });
                  
                  $("#facebook").click(function() {
                                       
                                       if(linkrel[window.currentID]==undefined) {
                                       var addurl='http://ideenkopierer.de';
                                       } else {
                                       var addurl=linkrel[window.currentID];
                                       }
                                       share("#ltwnds13 #ideenkopierer",addurl, 2);
                                       });
                  var loadNearby = function(lat, lng, distance) {
                  $("#progressnearby").fadeIn(function() {
                                              $.ajax({
                                                     url: 'http://pp90.de/umkreis.php?lat='+lat+'&long='+lng+'&distance='+distance,
                                                     dataType: 'json',
                                                     timeout: '5000',
                                                     success: function(e) {
                                                     if(e.success==1) {
                                                     $("#progressnearby").fadeOut();
                                                     
                                                     console.log(e);
                                                     var html = '';
                                                     var html2=''
                                                     for (var i = 0; i < e.entries.length; i++) {
                                                     console.log(e.entries[i]);
                                                     var start_date=new Date(e.entries[i].start_at);
                                                     var start_date_d = start_date.getDate();
                                                     var start_date_m = start_date.getMonth() + 1;
                                                     var start_date_y = start_date.getFullYear();
                                                     var start_date_hh = padZero(start_date.getHours().toString());
                                                     var start_date_mm = padZero(start_date.getMinutes().toString());
                                                     var end_date=new Date(e.entries[i].end_at);
                                                     var end_date_d = end_date.getDate();
                                                     var end_date_m = end_date.getMonth() + 1;
                                                     var end_date_y = end_date.getFullYear();
                                                     var end_date_hh = padZero(end_date.getHours().toString());
                                                     var end_date_mm = padZero(end_date.getMinutes().toString());
                                                     html += '<li>    <a href="#">' + e.entries[i].name + '</a><br /><p style="text-align:right;margin-top: -20px;margin-bottom:0px;"><i>'+e.entries[i].distance+' km - '+start_date_d+'.'+start_date_m+'.'+start_date_y+', '+start_date_hh+':'+start_date_mm+'</i></p></li>';
                                                     html2 +='<div class="stage_3_3_'+(i+1)+' stage subp panel blogtext" id=""><div class="contentPreHead last" id="c5"><span>Veranstaltungen</span></div><p class="event_title"><b>'+e.entries[i].name+'</b></p><p class="event_distance">Entfernung: '+e.entries[i].distance+'km</p><p>Ort: <a href="http://maps.apple.com/maps?daddr='+e.entries[i].address+'">'+e.entries[i].address+'</a></p><p class="event_start">Beginn: '+start_date_d+'.'+start_date_m+'.'+start_date_y+', '+start_date_hh+':'+start_date_mm+'</p><p class="event_end">Ende: '+end_date_d+'.'+end_date_m+'.'+end_date_y+', '+end_date_hh+':'+end_date_mm+'</p>'+e.entries[i].description+'</div>';
                                                     }
                                                     $('#nearby').html(html);
                                                     $('#nearbycontainer').html(html2);
                                                     $(".stage li").click(liclick);
                                                     $('.contentPreHead span').click(headclick);
                                                     $('.panel').height(window.innerHeight-270);
                                                     } else {
                                                     $("#progressnearby").fadeOut();
                                                     navigator.notification.alert('Ein Serverfehler ist aufgetreten. Der Webmaster wurde informiert. Bitte versuch es später noch einmal.', function(buttonIndex) {
                                                                                  },
                                                                                  'Veranstaltungssuche',
                                                                                  'OK'
                                                                                  );
                                                     }
                                                     },
                                                     error: ajaxErr
                                                     });
                                              });
                  }
                  var GeoOnSuccess = function(position) {
                  navigator.notification.alert('Bitte Suchumkreis wählen', function(buttonIndex) {
                                               if(buttonIndex==1) {var distance=10;}
                                               if(buttonIndex==2) {var distance=25;}
                                               if(buttonIndex==3) {var distance=50;}
                                               if(buttonIndex==4) {var distance=100;}
                                               if(buttonIndex==5) {var distance=0;}
                                               loadNearby(position.coords.latitude,position.coords.longitude,distance);
                                               },
                                               'Umkreis wählen',
                                               '10 km,25 km,50 km,100 km,Alle'
                                               );
                  };
                  function GeoOnError(error) {
                  if(error.code==1) {
                  navigator.notification.alert('Sie haben die Positionsbestimmung nicht erlaubt. Es werden alle Veranstaltungen angezeigt. Sie können diese Einstellung ändern unter "Einstellungen>Datenschutz>Ortungsdienste', function(buttonIndex) {
                                               },
                                               'Positionsbestimmung fehlgeschlagen',
                                               'OK'
                                               );
                  }
                  navigator.notification.alert('Die Positionsbestimmung ist fehlgeschlagen. Versuch es bitte noch mal oder klick "OK", um alle Veranstaltungen anzuzeigen.', function(buttonIndex) {
                                               if(buttonIndex==1) {
                                               navigator.geolocation.getCurrentPosition(GeoOnSuccess,
                                                                                        GeoOnError);
                                               } else {
                                               loadNearby(0,0);
                                               }
                                               },
                                               'Positionsbestimmung fehlgeschlagen',
                                               'Noch mal versuchen, OK'
                                               );
                  }
                  $("#c4").click(function() {
                                 navigator.geolocation.getCurrentPosition(GeoOnSuccess,
                                                                          GeoOnError);
                                 
                                 });
                  });