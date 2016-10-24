define(["events","libraryBrowser","imageLoader","cardBuilder"],function(events,libraryBrowser,imageLoader,cardBuilder){"use strict";return function(view,params,tabContent){function getPageData(context){var key=getSavedQueryKey(context),pageData=data[key];return pageData||(pageData=data[key]={query:{SortBy:"SortName",SortOrder:"Ascending",Fields:"PrimaryImageAspectRatio,SortName",StartIndex:0,ImageTypeLimit:1,EnableImageTypes:"Primary,Backdrop,Banner,Thumb",Limit:LibraryBrowser.getDefaultPageSize()},view:libraryBrowser.getSavedView(key)||"Poster"},pageData.query.ParentId=params.topParentId,libraryBrowser.loadSavedQueryValues(key,pageData.query)),pageData}function getQuery(context){return getPageData(context).query}function getSavedQueryKey(context){return context.savedQueryKey||(context.savedQueryKey=libraryBrowser.getSavedQueryKey("folders")),context.savedQueryKey}function reloadItems(page){Dashboard.showLoadingMsg();var query=getQuery(page);ApiClient.getItems(Dashboard.getCurrentUserId(),query).then(function(result){function onNextPageClick(){query.StartIndex+=query.Limit,reloadItems(tabContent)}function onPreviousPageClick(){query.StartIndex-=query.Limit,reloadItems(tabContent)}window.scrollTo(0,0);var i,length,pagingHtml=LibraryBrowser.getQueryPagingHtml({startIndex:query.StartIndex,limit:query.Limit,totalRecordCount:result.TotalRecordCount,showLimit:!1,updatePageSizeSetting:!1,addLayoutButton:!1,sortButton:!1,filterButton:!1}),html=cardBuilder.getCardsHtml({items:result.Items,shape:"square",context:"folders",showTitle:!0,showParentTitle:!0,lazy:!0,centerText:!0,overlayPlayButton:!0}),elems=tabContent.querySelectorAll(".paging");for(i=0,length=elems.length;i<length;i++)elems[i].innerHTML=pagingHtml;for(elems=tabContent.querySelectorAll(".btnNextPage"),i=0,length=elems.length;i<length;i++)elems[i].addEventListener("click",onNextPageClick);for(elems=tabContent.querySelectorAll(".btnPreviousPage"),i=0,length=elems.length;i<length;i++)elems[i].addEventListener("click",onPreviousPageClick);var itemsContainer=tabContent.querySelector(".itemsContainer");itemsContainer.innerHTML=html,imageLoader.lazyChildren(itemsContainer),libraryBrowser.saveQueryValues(getSavedQueryKey(page),query),Dashboard.hideLoadingMsg()})}var self=this,data={};self.getCurrentViewStyle=function(){return getPageData(tabContent).view},self.renderTab=function(){reloadItems(tabContent)},self.destroy=function(){}}});