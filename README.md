# [Angular Slideout Panels](https://tablelist.github.io/angular-slideout-panel/)

### Getting Started
1) Install via Bower
``` bash
bower install angular-slideout-panel --save
```

2) Add JS and CSS
``` bash
<script src="bower_components/angular-slideout-panel/release/js/angular-slideout-panel.min.js"></script>

<link rel="stylesheet" href="bower_components/angular-slideout-panel/release/css/angular-slideout-panel.min.css">
```

3) Add Angular Dependency
``` js
angular.module('demoApp', [
  'angular-slideout-panel'
]);
```

### Usage

``` js
angular.module('demoApp').controller('demoCtrl', [
  '$scope',
  'angularSlideOutPanel',
  function($scope, angularSlideOutPanel) {
    $scope.openPanel = function() {
      angularSlideOutPanel.open({
        template: template,
        openOn: 'left',
        controller: [
          '$scope',
          'user',
          modalController
        ],
        resolve: {
          user: [
            function() {
              return {
                firstName: 'Jerry'
              };
            }
          ]
        }
      });
    };

    function modalController($scope, user) {
      $scope.closePanel = function() {
        $scope.$panelInstance.close('this is from the controller!!');
      };

      $scope.dismissPanel = function() {
        $scope.$panelInstance.dismiss('this is from the controller!!');
      };

      $scope.user = user;
    }
  }
]);
```
