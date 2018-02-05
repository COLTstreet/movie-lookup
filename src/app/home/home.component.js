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
    vm.searchingShows = false;
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
    vm.viewMovies = viewMovies;
    vm.viewShows = viewShows;
    vm.selectShow = selectShow;

    init();
    // search();

    function init() {
      vm.viewMovies();

      $('#moviesPage').toggleClass('display');
    }

    function viewMovies(){
      //Popular movies call
      if(!vm.showMoviePage) {
        vm.showProgress = true;
        $.ajax({
          url : "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99",
          dataType : "jsonp",
          success : function(parsed_json) {
            $scope.$apply(function() { // put $scope var that needs to be updated
              vm.popularMovies = parsed_json.results;
              vm.showProgress = false;
              vm.showMoviePage = true;
              vm.showShowsPage = false;

              $('#moviesPage').toggleClass('display');
              $('#showsPage').toggleClass('display');
            });
          }
        });
      }
    }

    function viewShows(){
      //Popular tv shows call
      if(!vm.showShowsPage) {
        vm.showProgress = true;
        $.ajax({
					url : "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99",
          dataType : "jsonp",
          success : function(parsed_json) {
            $scope.$apply(function() { // put $scope var that needs to be updated
              vm.popularShows = parsed_json.results;
              vm.showProgress = false;
              vm.showShowsPage = true;
              vm.showMoviePage = false;

              console.log(vm.popularShows);

              $('#moviesPage').toggleClass('display');
              $('#showsPage').toggleClass('display');
            });
          }
        });
      }
    }

    function goHome() {
      vm.searching = false;
      vm.searchingShows = false;
    }

    function addToRequest(movie) {
      if(vm.showMoviePage){
        if(!vm.requestListStrings.includes(movie.title)){
          vm.requestListStrings.push(movie.title);
          vm.requestList.push(movie);
        }
      } else {
        if(!vm.requestListStrings.includes(movie.name)){
          vm.requestListStrings.push(movie.name);
          vm.requestList.push(movie);
        }
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
            for(var i = 0; i < 2; i++) {
              if(i === 1){
                vm.selectedMovie.genreString += vm.selectedMovie.genres[i].name;
              } else {
                vm.selectedMovie.genreString += vm.selectedMovie.genres[i].name + ", ";
              }
            }

            if(vm.selectedMovie.homepage !== ""){
              vm.showMovieSite = true;
            } else {
              vm.showMovieSite = false;
            }

            $(function() {
                var height = $("#movie-info-container-" + index).outerHeight();
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

    function selectShow(index, show) {
      $.ajax({
        url : "https://api.themoviedb.org/3/tv/" + show.id + "?api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99&language=en-US&append_to_response=videos",
        dataType : "jsonp",
        success : function(parsed_json) {
          $scope.$apply(function() { // put $scope var that needs to be updated
            console.log(parsed_json);
            vm.selectedShow = parsed_json;
            vm.selectedShow.genreString = "";
            for(var i = 0; i < vm.selectedShow.genres.length; i++) {
              if(i < 2) {
                if(i === 1){
                  vm.selectedShow.genreString += vm.selectedShow.genres[i].name;
                } else {
                  vm.selectedShow.genreString += vm.selectedShow.genres[i].name + ", ";
                }
              }
            }
            vm.selectedShow.createdByString = "";
            for(var i = 0; i < vm.selectedShow.created_by.length; i++) {
              if(i < 2) {
                if(i === 1){
                  vm.selectedShow.createdByString += vm.selectedShow.created_by[i].name;
                } else {
                  vm.selectedShow.createdByString += vm.selectedShow.created_by[i].name + ", ";
                }
              }
            }

            if(vm.selectedShow.homepage !== ""){
              vm.showShowSite = true;
            } else {
              vm.showShowSite = false;
            }

            $(function() {
                var height = $("#show-info-container-" + index).outerHeight();
                $("#show-trailer-container-" + index).attr("src", "https://www.youtube.com/embed/" + vm.selectedShow.videos.results[0].key);
                $("#show-tile-lg-info-container-" + index).css("height", height);
            });

          });
        }
      });
      $('#tile-show-' + index).toggleClass('fullscreen');
      $('#title-show-' + index).toggleClass('display');
      $('#title-big-show-' + index).toggleClass('display');
    }

    function search(string) {
      vm.showProgress = true;

      if(vm.showMoviePage){
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
      } else {
        var query = encodeURI(string);
        // Search
        $.ajax({
            url : "https://api.themoviedb.org/3/search/tv?api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99&query=" + query,
            dataType : "jsonp",
            success : function(parsed_json) {
              $scope.$apply(function() { // put $scope var that needs to be updated
                vm.searchShows = parsed_json.results;
                vm.searchingShows = true;
                vm.showProgress = false;
              });
            }
          });
      }
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
