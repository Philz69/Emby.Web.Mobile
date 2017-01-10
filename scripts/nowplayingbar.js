define(["datetime","userdataButtons","itemHelper","events","browser","imageLoader","playbackManager","nowPlayingHelper","apphost","dom","connectionManager","paper-icon-button-light"],function(datetime,userdataButtons,itemHelper,events,browser,imageLoader,playbackManager,nowPlayingHelper,appHost,dom,connectionManager){"use strict";function getNowPlayingBarHtml(){var html="";return html+='<div class="nowPlayingBar hide nowPlayingBar-hidden">',html+='<div class="nowPlayingBarTop">',html+='<div class="nowPlayingBarPositionContainer sliderContainer">',html+='<input type="range" is="emby-slider" pin step=".01" min="0" max="100" value="0" class="nowPlayingBarPositionSlider"/>',html+="</div>",html+='<div class="nowPlayingBarInfoContainer">',html+='<div class="nowPlayingImage"></div>',html+='<div class="nowPlayingBarText"></div>',html+="</div>",html+='<div class="nowPlayingBarCenter">',html+='<button is="paper-icon-button-light" class="previousTrackButton mediaButton autoSize"><i class="md-icon">skip_previous</i></button>',html+='<button is="paper-icon-button-light" class="playPauseButton mediaButton autoSize"><i class="md-icon">pause</i></button>',html+='<button is="paper-icon-button-light" class="stopButton mediaButton autoSize"><i class="md-icon">stop</i></button>',html+='<button is="paper-icon-button-light" class="nextTrackButton mediaButton autoSize"><i class="md-icon">skip_next</i></button>',html+='<div class="nowPlayingBarCurrentTime"></div>',html+="</div>",html+='<div class="nowPlayingBarRight">',html+='<button is="paper-icon-button-light" class="muteButton mediaButton autoSize"><i class="md-icon">volume_up</i></button>',html+='<div class="sliderContainer nowPlayingBarVolumeSliderContainer hide" style="width:100px;vertical-align:middle;display:inline-flex;">',html+='<input type="range" is="emby-slider" pin step="1" min="0" max="100" value="0" class="nowPlayingBarVolumeSlider"/>',html+="</div>",html+='<button is="paper-icon-button-light" class="toggleRepeatButton mediaButton autoSize"><i class="md-icon">repeat</i></button>',html+='<div class="nowPlayingBarUserDataButtons">',html+="</div>",html+='<button is="paper-icon-button-light" class="playPauseButton mediaButton autoSize"><i class="md-icon">pause</i></button>',html+='<button is="paper-icon-button-light" class="remoteControlButton mediaButton autoSize"><i class="md-icon">tablet_android</i></button>',html+='<button is="paper-icon-button-light" class="playlistButton mediaButton autoSize"><i class="md-icon">queue_music</i></button>',html+="</div>",html+="</div>",html+="</div>"}function onSlideDownComplete(){this.classList.add("hide")}function slideDown(elem){requestAnimationFrame(function(){void elem.offsetWidth,elem.classList.add("nowPlayingBar-hidden"),dom.addEventListener(elem,dom.whichTransitionEvent(),onSlideDownComplete,{once:!0})})}function slideUp(elem){elem.classList.remove("hide"),dom.removeEventListener(elem,dom.whichTransitionEvent(),onSlideDownComplete,{once:!0}),requestAnimationFrame(function(){void elem.offsetWidth,elem.classList.remove("nowPlayingBar-hidden")})}function onPlayPauseClick(){playbackManager.playPause(currentPlayer)}function bindEvents(elem){currentTimeElement=elem.querySelector(".nowPlayingBarCurrentTime"),nowPlayingImageElement=elem.querySelector(".nowPlayingImage"),nowPlayingTextElement=elem.querySelector(".nowPlayingBarText"),nowPlayingUserData=elem.querySelector(".nowPlayingBarUserDataButtons"),muteButton=elem.querySelector(".muteButton"),muteButton.addEventListener("click",function(){currentPlayer&&playbackManager.toggleMute(currentPlayer)}),elem.querySelector(".stopButton").addEventListener("click",function(){currentPlayer&&playbackManager.stop(currentPlayer)});var i,length;for(playPauseButtons=elem.querySelectorAll(".playPauseButton"),i=0,length=playPauseButtons.length;i<length;i++)playPauseButtons[i].addEventListener("click",onPlayPauseClick);elem.querySelector(".nextTrackButton").addEventListener("click",function(){currentPlayer&&playbackManager.nextTrack(currentPlayer)}),elem.querySelector(".previousTrackButton").addEventListener("click",function(){currentPlayer&&playbackManager.previousTrack(currentPlayer)}),elem.querySelector(".remoteControlButton").addEventListener("click",function(){showRemoteControl()}),elem.querySelector(".playlistButton").addEventListener("click",function(){showRemoteControl(2)}),toggleRepeatButton=elem.querySelector(".toggleRepeatButton"),toggleRepeatButton.addEventListener("click",function(){if(currentPlayer){var state=lastPlayerState||{};switch((state.PlayState||{}).RepeatMode){case"RepeatAll":playbackManager.setRepeatMode("RepeatOne",currentPlayer);break;case"RepeatOne":playbackManager.setRepeatMode("RepeatNone",currentPlayer);break;default:playbackManager.setRepeatMode("RepeatAll",currentPlayer)}}}),toggleRepeatButtonIcon=toggleRepeatButton.querySelector("i"),volumeSlider=elem.querySelector(".nowPlayingBarVolumeSlider"),volumeSliderContainer=elem.querySelector(".nowPlayingBarVolumeSliderContainer"),appHost.supports("physicalvolumecontrol")?volumeSliderContainer.classList.add("hide"):volumeSliderContainer.classList.remove("hide"),volumeSlider.addEventListener("change",function(){currentPlayer&&currentPlayer.setVolume(this.value)}),positionSlider=elem.querySelector(".nowPlayingBarPositionSlider"),positionSlider.addEventListener("change",function(){if(currentPlayer){var newPercent=parseFloat(this.value);playbackManager.seekPercent(newPercent,currentPlayer)}}),positionSlider.getBubbleText=function(value){var state=lastPlayerState;if(!state||!state.NowPlayingItem||!currentRuntimeTicks)return"--:--";var ticks=currentRuntimeTicks;return ticks/=100,ticks*=value,datetime.getDisplayRunningTime(ticks)}}function showRemoteControl(tabIndex){tabIndex?Dashboard.navigate("nowplaying.html?tab="+tabIndex):Dashboard.navigate("nowplaying.html")}function getNowPlayingBar(){return nowPlayingBarElement?Promise.resolve(nowPlayingBarElement):new Promise(function(resolve,reject){require(["appfooter-shared","itemShortcuts","css!css/nowplayingbar.css","emby-slider"],function(appfooter,itemShortcuts){var parentContainer=appfooter.element;return(nowPlayingBarElement=parentContainer.querySelector(".nowPlayingBar"))?void resolve(nowPlayingBarElement):(parentContainer.insertAdjacentHTML("afterbegin",getNowPlayingBarHtml()),nowPlayingBarElement=parentContainer.querySelector(".nowPlayingBar"),browser.safari&&browser.slow&&nowPlayingBarElement.classList.add("noMediaProgress"),itemShortcuts.on(nowPlayingBarElement),bindEvents(nowPlayingBarElement),void resolve(nowPlayingBarElement))})})}function showButton(button){button.classList.remove("hide")}function hideButton(button){button.classList.add("hide")}function updatePlayPauseState(isPaused){var i,length;if(playPauseButtons)if(isPaused)for(i=0,length=playPauseButtons.length;i<length;i++)playPauseButtons[i].querySelector("i").innerHTML="play_arrow";else for(i=0,length=playPauseButtons.length;i<length;i++)playPauseButtons[i].querySelector("i").innerHTML="pause"}function updatePlayerStateInternal(event,state){showNowPlayingBar(),lastPlayerState=state;var playerInfo=playbackManager.getPlayerInfo(),playState=state.PlayState||{};updatePlayPauseState(playState.IsPaused);var supportedCommands=playerInfo.supportedCommands;currentPlayerSupportedCommands=supportedCommands,supportedCommands.indexOf("SetRepeatMode")==-1?toggleRepeatButton.classList.add("hide"):toggleRepeatButton.classList.remove("hide"),"RepeatAll"==playState.RepeatMode?(toggleRepeatButtonIcon.innerHTML="repeat",toggleRepeatButton.classList.add("repeatActive")):"RepeatOne"==playState.RepeatMode?(toggleRepeatButtonIcon.innerHTML="repeat_one",toggleRepeatButton.classList.add("repeatActive")):(toggleRepeatButtonIcon.innerHTML="repeat",toggleRepeatButton.classList.remove("repeatActive")),updatePlayerVolumeState(playState.IsMuted,playState.VolumeLevel),positionSlider&&!positionSlider.dragging&&(positionSlider.disabled=!playState.CanSeek);var nowPlayingItem=state.NowPlayingItem||{};updateTimeDisplay(playState.PositionTicks,nowPlayingItem.RunTimeTicks),updateNowPlayingInfo(state)}function updateTimeDisplay(positionTicks,runtimeTicks){if(positionSlider&&!positionSlider.dragging)if(runtimeTicks){var pct=positionTicks/runtimeTicks;pct*=100,positionSlider.value=pct}else positionSlider.value=0;if(currentTimeElement){var timeText=null==positionTicks?"--:--":datetime.getDisplayRunningTime(positionTicks);runtimeTicks&&(timeText+=" / "+datetime.getDisplayRunningTime(runtimeTicks)),currentTimeElement.innerHTML=timeText}}function updatePlayerVolumeState(isMuted,volumeLevel){var supportedCommands=currentPlayerSupportedCommands,showMuteButton=!0,showVolumeSlider=!0;supportedCommands.indexOf("ToggleMute")==-1&&(showMuteButton=!1),isMuted?muteButton.querySelector("i").innerHTML="&#xE04F;":muteButton.querySelector("i").innerHTML="&#xE050;",supportedCommands.indexOf("SetVolume")==-1&&(showVolumeSlider=!1),currentPlayer.isLocalPlayer&&appHost.supports("physicalvolumecontrol")&&(showMuteButton=!1,showVolumeSlider=!1),showMuteButton?showButton(muteButton):hideButton(muteButton),volumeSlider&&(showVolumeSlider?volumeSliderContainer.classList.remove("hide"):volumeSliderContainer.classList.add("hide"),volumeSlider.dragging||(volumeSlider.value=volumeLevel||0))}function getTextActionButton(item,text){text||(text=itemHelper.getDisplayName(item));var html='<button data-id="'+item.Id+'" data-type="'+item.Type+'" data-mediatype="'+item.MediaType+'" data-channelid="'+item.ChannelId+'" data-isfolder="'+item.IsFolder+'" type="button" class="itemAction textActionButton" data-action="link">';return html+=text,html+="</button>"}function seriesImageUrl(item,options){if(!item)throw new Error("item cannot be null!");if("Episode"!==item.Type)return null;if(options=options||{},options.type=options.type||"Primary","Primary"===options.type&&item.SeriesPrimaryImageTag)return options.tag=item.SeriesPrimaryImageTag,connectionManager.getApiClient(item.ServerId).getScaledImageUrl(item.SeriesId,options);if("Thumb"===options.type){if(item.SeriesThumbImageTag)return options.tag=item.SeriesThumbImageTag,connectionManager.getApiClient(item.ServerId).getScaledImageUrl(item.SeriesId,options);if(item.ParentThumbImageTag)return options.tag=item.ParentThumbImageTag,connectionManager.getApiClient(item.ServerId).getScaledImageUrl(item.ParentThumbItemId,options)}return null}function imageUrl(item,options){if(!item)throw new Error("item cannot be null!");return options=options||{},options.type=options.type||"Primary",item.ImageTags&&item.ImageTags[options.type]?(options.tag=item.ImageTags[options.type],connectionManager.getApiClient(item.ServerId).getScaledImageUrl(item.PrimaryImageItemId||item.Id,options)):item.AlbumId&&item.AlbumPrimaryImageTag?(options.tag=item.AlbumPrimaryImageTag,connectionManager.getApiClient(item.ServerId).getScaledImageUrl(item.AlbumId,options)):null}function updateNowPlayingInfo(state){var nowPlayingItem=state.NowPlayingItem;nowPlayingTextElement.innerHTML=nowPlayingItem?nowPlayingHelper.getNowPlayingNames(nowPlayingItem).map(function(nowPlayingName){return nowPlayingName.item?"<div>"+getTextActionButton(nowPlayingName.item,nowPlayingName.text)+"</div>":"<div>"+nowPlayingName.text+"</div>"}).join(""):"";var imgHeight=70,url=nowPlayingItem?seriesImageUrl(nowPlayingItem,{height:imgHeight})||imageUrl(nowPlayingItem,{height:imgHeight}):null;url!==currentImgUrl&&(currentImgUrl=url,imageLoader.lazyImage(nowPlayingImageElement,url),userdataButtons.destroy({element:nowPlayingUserData}),nowPlayingItem.Id&&ApiClient.getItem(Dashboard.getCurrentUserId(),nowPlayingItem.Id).then(function(item){userdataButtons.fill({item:item,includePlayed:!1,element:nowPlayingUserData})}))}function onPlaybackStart(e,state){console.log("nowplaying event: "+e.type);var player=this;onStateChanged.call(player,e,state)}function showNowPlayingBar(){getNowPlayingBar().then(slideUp)}function hideNowPlayingBar(){isEnabled=!1;var elem=document.getElementsByClassName("nowPlayingBar")[0];elem&&slideDown(elem)}function onPlaybackStopped(e,state){console.log("nowplaying event: "+e.type);hideNowPlayingBar()}function onPlayPauseStateChanged(e){if(isEnabled){var player=this;updatePlayPauseState(player.paused())}}function onStateChanged(event,state){var player=this;return state.NowPlayingItem?player.isLocalPlayer&&state.NowPlayingItem&&"Video"==state.NowPlayingItem.MediaType?void hideNowPlayingBar():(isEnabled=!0,nowPlayingBarElement?void updatePlayerStateInternal(event,state):void getNowPlayingBar().then(function(){updatePlayerStateInternal(event,state)})):void hideNowPlayingBar()}function onTimeUpdate(e){if(isEnabled){var now=(new Date).getTime();if(!(now-lastUpdateTime<700)){lastUpdateTime=now;var player=this;currentRuntimeTicks=playbackManager.duration(player),updateTimeDisplay(playbackManager.currentTime(player),currentRuntimeTicks)}}}function releaseCurrentPlayer(){var player=currentPlayer;player&&(events.off(player,"playbackstart",onPlaybackStart),events.off(player,"statechange",onPlaybackStart),events.off(player,"repeatmodechange",onPlaybackStart),events.off(player,"playbackstop",onPlaybackStopped),events.off(player,"volumechange",onVolumeChanged),events.off(player,"pause",onPlayPauseStateChanged),events.off(player,"playing",onPlayPauseStateChanged),events.off(player,"timeupdate",onTimeUpdate),currentPlayer=null,hideNowPlayingBar())}function onVolumeChanged(e){if(isEnabled){var player=this;updatePlayerVolumeState(player.isMuted(),player.getVolume())}}function bindToPlayer(player){player!==currentPlayer&&(releaseCurrentPlayer(),currentPlayer=player,player&&(playbackManager.getPlayerState(player).then(function(state){onStateChanged.call(player,{type:"init"},state)}),events.on(player,"playbackstart",onPlaybackStart),events.on(player,"statechange",onPlaybackStart),events.on(player,"repeatmodechange",onPlaybackStart),events.on(player,"playbackstop",onPlaybackStopped),events.on(player,"volumechange",onVolumeChanged),events.on(player,"pause",onPlayPauseStateChanged),events.on(player,"playing",onPlayPauseStateChanged),events.on(player,"timeupdate",onTimeUpdate)))}var currentPlayer,currentTimeElement,nowPlayingImageElement,nowPlayingTextElement,nowPlayingUserData,muteButton,volumeSlider,volumeSliderContainer,playPauseButtons,positionSlider,toggleRepeatButton,toggleRepeatButtonIcon,isEnabled,nowPlayingBarElement,currentImgUrl,currentPlayerSupportedCommands=[],lastUpdateTime=0,lastPlayerState={},currentRuntimeTicks=0;events.on(playbackManager,"playerchange",function(){bindToPlayer(playbackManager.getCurrentPlayer())}),bindToPlayer(playbackManager.getCurrentPlayer())});