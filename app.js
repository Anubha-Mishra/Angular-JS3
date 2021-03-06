(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService',MenuSearchService)
  .directive('foundItems', FoundItems);

  function FoundItems() {
    var ddo = {
      templateUrl: 'itemsList.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'list',
      bindToController: true
    };
    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];

  function NarrowItDownController(MenuSearchService) {
    var list = this;

    list.description = "";
    list.foundMenu = function() {

      if((list.description != null) && (list.description != "")) {
        list.error = false;
        var promise = MenuSearchService.getMatchedMenuItems(list.description);

        promise.then(function (response) {
          list.found = response;
        }).catch(function (error) {
          console.log("Something went terribly wrong.");
        });
      }
      else {
        list.error = true;
        list.message = "Nothing Found";
      }

    }

    list.removeItem = function(itemIndex) {
      list.found.splice(itemIndex,1);
    }
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
      var response = $http({
        method: "GET",
        url: "https://davids-restaurant.herokuapp.com/menu_items.json"
        }).then(function (response) {
          var menuList = response.data.menu_items;
          var foundItems = [];

          for(var i in menuList) {
            if(menuList[i].description.indexOf(searchTerm) > -1) {
              foundItems.push(menuList[i]);
            }
          }
          return foundItems;
        }).catch(function (error) {
          console.log("Something went terribly wrong.");
        });
        return response;
     }
  }
})();
