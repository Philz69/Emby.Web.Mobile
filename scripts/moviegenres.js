define(["libraryBrowser","cardBuilder"],function(libraryBrowser,cardBuilder){"use strict";return function(view,params,tabContent){function getPageData(){var key=getSavedQueryKey(),pageData=data[key];return pageData||(pageData=data[key]={query:{SortBy:"SortName",SortOrder:"Ascending",IncludeItemTypes:"Movie",Recursive:!0,Fields:"DateCreated,ItemCounts,PrimaryImageAspectRatio",StartIndex:0},view:libraryBrowser.getSavedView(key)||"Thumb"},pageData.query.ParentId=params.topParentId,libraryBrowser.loadSavedQueryValues(key,pageData.query)),pageData}function getQuery(){return getPageData().query}function getSavedQueryKey(){return libraryBrowser.getSavedQueryKey("genres")}function getPromise(){Dashboard.showLoadingMsg();var query=getQuery();return ApiClient.getGenres(Dashboard.getCurrentUserId(),query)}function reloadItems(context,promise){var query=getQuery();promise.then(function(result){var viewStyle=self.getCurrentViewStyle(),elem=context.querySelector("#items");"Thumb"==viewStyle?cardBuilder.buildCards(result.Items,{itemsContainer:elem,shape:"backdrop",preferThumb:!0,showTitle:!0,scalable:!0,showItemCounts:!0,centerText:!0,overlayMoreButton:!0}):"ThumbCard"==viewStyle?cardBuilder.buildCards(result.Items,{itemsContainer:elem,shape:"backdrop",preferThumb:!0,showTitle:!0,scalable:!0,showItemCounts:!0,centerText:!1,cardLayout:!0}):"PosterCard"==viewStyle?cardBuilder.buildCards(result.Items,{itemsContainer:elem,shape:"auto",showTitle:!0,scalable:!0,showItemCounts:!0,centerText:!1,cardLayout:!0}):"Poster"==viewStyle&&cardBuilder.buildCards(result.Items,{itemsContainer:elem,shape:"auto",showTitle:!0,scalable:!0,showItemCounts:!0,centerText:!0,overlayMoreButton:!0}),libraryBrowser.saveQueryValues(getSavedQueryKey(),query),Dashboard.hideLoadingMsg()})}function fullyReload(){self.preRender(),self.renderTab()}var self=this,data={};self.getViewStyles=function(){return"Poster,PosterCard,Thumb,ThumbCard".split(",")},self.getCurrentViewStyle=function(){return getPageData(tabContent).view},self.setCurrentViewStyle=function(viewStyle){getPageData(tabContent).view=viewStyle,libraryBrowser.saveViewSetting(getSavedQueryKey(tabContent),viewStyle),fullyReload()},self.enableViewSelection=!0;var promise;self.preRender=function(){promise=getPromise()},self.renderTab=function(){reloadItems(tabContent,promise)};var btnSelectView=tabContent.querySelector(".btnSelectView");btnSelectView.addEventListener("click",function(e){libraryBrowser.showLayoutMenu(e.target,self.getCurrentViewStyle(),self.getViewStyles())}),btnSelectView.addEventListener("layoutchange",function(e){self.setCurrentViewStyle(e.detail.viewStyle)})}});