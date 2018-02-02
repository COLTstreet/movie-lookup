(function() {
  'use strict';

  angular.module('app').component('home', {
    controller: HomeController,
    controllerAs: 'vm',
    templateUrl: 'app/home/home.view.html',
  });

  /** @ngInject */
  function HomeController($scope) {
    var vm = this;

    vm.greeting = '';
    vm.searching = false;
    vm.showProgress = false;
    vm.requestListStrings = [];
    vm.requestList = [];
    vm.showSelected = false;

    vm.select = select;
    vm.search = search;
    vm.goHome = goHome;
    vm.addToRequest = addToRequest;
    vm.removeRequest = removeRequest;
    vm.viewSelected = viewSelected;
    vm.sendRequest = sendRequest;

    init();
    // search();

    function init() {
      vm.showProgress = true;
      //Popular movies call
      $.ajax({
        url : "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99",
        dataType : "jsonp",
        success : function(parsed_json) {
          $scope.$apply(function() { // put $scope var that needs to be updated
            vm.popularMovies = parsed_json.results;
            vm.showProgress = false;
          });
        }
      });
    }

    function goHome() {
      vm.searching = false;
    }

    function addToRequest(movie) {
      if(!vm.requestListStrings.includes(movie.title)){
        vm.requestListStrings.push(movie.title);
        vm.requestList.push(movie);
      }
    }

    function removeRequest(movie, index) {
      vm.requestList.splice(index, 1);
      vm.requestListStrings.splice(index, 1);
    }

    function viewSelected(){
      if(!vm.showSelected){
        $(".footer").height("120px");
        vm.showSelected = !vm.showSelected;
      } else {
        $(".footer").height("0px");
        vm.showSelected = !vm.showSelected;
      }
    }

    function select(index, movie) {
      $.ajax({
        url : "https://api.themoviedb.org/3/movie/" + movie.id + "?api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99&language=en-US&append_to_response=videos",
        dataType : "jsonp",
        success : function(parsed_json) {
          $scope.$apply(function() { // put $scope var that needs to be updated
            console.log(parsed_json);
            vm.selectedMovie = parsed_json;
            vm.selectedMovie.genreString = "";
            for(let i = 0; i < 2; i++) {
              if(i === 1){
                vm.selectedMovie.genreString += vm.selectedMovie.genres[i].name;
              } else {
                vm.selectedMovie.genreString += vm.selectedMovie.genres[i].name + ",";
              }
            }

            if(vm.selectedMovie.homepage !== ""){
              vm.showMovieSite = true;
            } else {
              vm.showMovieSite = false;
            }

            $(function() {
                let height = $("#movie-info-container-" + index).outerHeight();
                $("#movie-trailer-container-" + index).attr("src", "https://www.youtube.com/embed/" + vm.selectedMovie.videos.results[0].key);
                $("#movie-tile-lg-info-container-" + index).css("height", height);
            });

          });
        }
      });
      $('#tile-' + index).toggleClass('fullscreen');
      $('#title-' + index).toggleClass('display');
      $('#title-big-' + index).toggleClass('display');
    }

    function search(string) {
      vm.showProgress = true;
      var query = encodeURI(string);
      // Search
      $.ajax({
					url : "https://api.themoviedb.org/3/search/movie?api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99&query=" + query,
					dataType : "jsonp",
					success : function(parsed_json) {
						$scope.$apply(function() { // put $scope var that needs to be updated
              vm.searchMovies = parsed_json.results;
              vm.searching = true;
              vm.showProgress = false;
						});
					}
        });
    }

    function sendRequest() {
      var email = "sbframp@gmail.com";
      var subject = "Plex Request";
      var body = "";

      for(var i = 0; i < vm.requestListStrings.length; i++) {
        var movie = vm.requestListStrings[i].replace("&", "and");
        body += movie + ", "
      }

      window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
    }

  }

})();
