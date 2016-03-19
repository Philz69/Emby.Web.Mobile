﻿define(['jQuery'],function($){var query={SortBy:"SortName",SortOrder:"Ascending",IncludeItemTypes:"GameSystem",Recursive:true,Fields:"DateCreated",StartIndex:0,ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Banner,Thumb"};function getSavedQueryKey(){return LibraryBrowser.getSavedQueryKey();}
function reloadItems(page){Dashboard.showLoadingMsg();ApiClient.getItems(Dashboard.getCurrentUserId(),query).then(function(result){window.scrollTo(0,0);updateFilterControls(page);var html=LibraryBrowser.getPosterViewHtml({items:result.Items,shape:"backdrop",context:'games',showTitle:true,centerText:true,lazy:true});var elem=page.querySelector('#items');elem.innerHTML=html;ImageLoader.lazyChildren(elem);LibraryBrowser.saveQueryValues(getSavedQueryKey(),query);Dashboard.hideLoadingMsg();});}
function updateFilterControls(page){}
$(document).on('pagebeforeshow',"#gamesystemsPage",function(){query.ParentId=LibraryMenu.getTopParentId();var limit=LibraryBrowser.getDefaultPageSize();if(limit!=query.Limit){query.Limit=limit;query.StartIndex=0;}
LibraryBrowser.loadSavedQueryValues(getSavedQueryKey(),query);reloadItems(this);updateFilterControls(this);});});