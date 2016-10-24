define(["libraryBrowser","cardBuilder"],function(libraryBrowser,cardBuilder){"use strict";function getQuery(params){var key=getSavedQueryKey(),pageData=data[key];return pageData||(pageData=data[key]={query:{SortBy:"SortName",SortOrder:"Ascending",IncludeItemTypes:"Movie",Recursive:!0,Fields:"DateCreated,ItemCounts,PrimaryImageAspectRatio",StartIndex:0}},pageData.query.ParentId=params.topParentId),pageData.query}function getSavedQueryKey(){return libraryBrowser.getSavedQueryKey("studios")}function getPromise(context,params){var query=getQuery(params);return Dashboard.showLoadingMsg(),ApiClient.getStudios(Dashboard.getCurrentUserId(),query)}function reloadItems(context,params,promise){promise.then(function(result){var elem=context.querySelector("#items");cardBuilder.buildCards(result.Items,{itemsContainer:elem,shape:"backdrop",preferThumb:!0,showTitle:!1,scalable:!0,showItemCounts:!0,centerText:!0,overlayMoreButton:!0}),Dashboard.hideLoadingMsg()})}var data={};return function(view,params,tabContent){var promise,self=this;self.preRender=function(){promise=getPromise(view,params)},self.renderTab=function(){reloadItems(tabContent,params,promise)}}});