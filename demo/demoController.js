angular.module('demoApp').controller('demoController', [
  '$scope',
  'angularSlideOutPanel',
  function ($scope, angularSlideOutPanel) {
    var template1 = '<div class="">' +
      '<h1>Test Panel!!</h1>' +
      '<button class="btn btn-primary" ng-click="closePanel()">Close Me</button>' +
      '<button class="btn btn-primary" ng-click="dismissPanel()">Dismiss Me</button>' +
      '<button class="btn btn-primary" ng-click="openInnerPanel()">Open Inner Panel</button>' +
      '<br>' +
      '<br>' +
      '<br>' +
      'Resolved User : {{ user.firstName }}' +
      '<br>' +
      '<p>' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultricies quam diam, quis tempor tellus posuere eu. Vestibulum ac massa rhoncus tellus aliquet lobortis id non tortor. Vestibulum at imperdiet justo. Mauris at dolor ultricies, vestibulum' +
      'lectus sit amet, ultricies erat. Nunc varius turpis vel vestibulum efficitur. Vestibulum elementum leo quis erat pulvinar tincidunt. Nulla eget purus ultrices, vehicula massa quis, fringilla ex. Nam tincidunt finibus quam id laoreet. Maecenas ac eleifend' +
      'lectus. Proin porttitor mi vel mauris vulputate, ac accumsan ex eleifend. Pellentesque venenatis magna justo, eget volutpat dolor pretium eget. Aliquam vitae velit in nulla posuere dictum. Aenean commodo, magna quis molestie maximus, lectus lorem' +
      'iaculis velit, nec pharetra justo erat tincidunt augue. Vestibulum pharetra erat et volutpat luctus. Sed purus nibh, semper ac vulputate ac, aliquam in erat. Aenean sagittis mi vitae lectus semper congue. Morbi rhoncus in justo at accumsan. Nulla' +
      'euismod velit in dolor egestas, et dapibus sem ultricies. Integer ultrices tortor pellentesque luctus molestie. Nulla eu vestibulum ipsum. Mauris eget porttitor libero, vitae egestas lorem. Cras sed ex et sem porta consequat. Ut rutrum massa elementum,' +
      'feugiat neque eu, tincidunt velit. Proin imperdiet quam in pulvinar feugiat. Quisque condimentum mauris nec interdum efficitur. Aenean mollis congue nibh, ac feugiat odio egestas nec. Maecenas et dolor sed sapien iaculis condimentum quis ac ante.' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat porttitor quam. Vestibulum tempor sem eros, sed volutpat elit pellentesque luctus. Pellentesque fermentum at metus quis blandit. Phasellus vulputate id justo sit amet pretium. In' +
      'porta, nulla vel semper porttitor, felis odio commodo ipsum, at sodales nisi lacus id velit. Vivamus porta gravida ex, vel fringilla turpis aliquam id. Donec et cursus neque, ut elementum enim. Praesent elementum arcu dapibus ipsum dapibus, vehicula' +
      'tristique nulla sagittis. Praesent feugiat nibh felis, non tristique libero sodales at. Praesent lacus sapien, scelerisque sed lorem sit amet, scelerisque aliquet turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id bibendum' +
      'libero, id sagittis elit. Aliquam erat volutpat. Quisque pretium maximus euismod. In vel quam justo. Maecenas a elementum turpis. Etiam nec laoreet leo, a malesuada erat. Pellentesque efficitur justo sed cursus pulvinar. Suspendisse scelerisque viverra' +
      'nisl, vitae feugiat arcu pellentesque et. In odio sem, tristique eget felis vitae, gravida vulputate augue. Praesent facilisis quam vestibulum ipsum ornare auctor quis in libero.' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultricies quam diam, quis tempor tellus posuere eu. Vestibulum ac massa rhoncus tellus aliquet lobortis id non tortor. Vestibulum at imperdiet justo. Mauris at dolor ultricies, vestibulum' +
      'lectus sit amet, ultricies erat. Nunc varius turpis vel vestibulum efficitur. Vestibulum elementum leo quis erat pulvinar tincidunt. Nulla eget purus ultrices, vehicula massa quis, fringilla ex. Nam tincidunt finibus quam id laoreet. Maecenas ac eleifend' +
      'lectus. Proin porttitor mi vel mauris vulputate, ac accumsan ex eleifend. Pellentesque venenatis magna justo, eget volutpat dolor pretium eget. Aliquam vitae velit in nulla posuere dictum. Aenean commodo, magna quis molestie maximus, lectus lorem' +
      'iaculis velit, nec pharetra justo erat tincidunt augue. Vestibulum pharetra erat et volutpat luctus. Sed purus nibh, semper ac vulputate ac, aliquam in erat. Aenean sagittis mi vitae lectus semper congue. Morbi rhoncus in justo at accumsan. Nulla' +
      'euismod velit in dolor egestas, et dapibus sem ultricies. Integer ultrices tortor pellentesque luctus molestie. Nulla eu vestibulum ipsum. Mauris eget porttitor libero, vitae egestas lorem. Cras sed ex et sem porta consequat. Ut rutrum massa elementum,' +
      'feugiat neque eu, tincidunt velit. Proin imperdiet quam in pulvinar feugiat. Quisque condimentum mauris nec interdum efficitur. Aenean mollis congue nibh, ac feugiat odio egestas nec. Maecenas et dolor sed sapien iaculis condimentum quis ac ante.' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat porttitor quam. Vestibulum tempor sem eros, sed volutpat elit pellentesque luctus. Pellentesque fermentum at metus quis blandit. Phasellus vulputate id justo sit amet pretium. In' +
      'porta, nulla vel semper porttitor, felis odio commodo ipsum, at sodales nisi lacus id velit. Vivamus porta gravida ex, vel fringilla turpis aliquam id. Donec et cursus neque, ut elementum enim. Praesent elementum arcu dapibus ipsum dapibus, vehicula' +
      'tristique nulla sagittis. Praesent feugiat nibh felis, non tristique libero sodales at. Praesent lacus sapien, scelerisque sed lorem sit amet, scelerisque aliquet turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id bibendum' +
      'libero, id sagittis elit. Aliquam erat volutpat. Quisque pretium maximus euismod. In vel quam justo. Maecenas a elementum turpis. Etiam nec laoreet leo, a malesuada erat. Pellentesque efficitur justo sed cursus pulvinar. Suspendisse scelerisque viverra' +
      'nisl, vitae feugiat arcu pellentesque et. In odio sem, tristique eget felis vitae, gravida vulputate augue. Praesent facilisis quam vestibulum ipsum ornare auctor quis in libero.' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultricies quam diam, quis tempor tellus posuere eu. Vestibulum ac massa rhoncus tellus aliquet lobortis id non tortor. Vestibulum at imperdiet justo. Mauris at dolor ultricies, vestibulum' +
      'lectus sit amet, ultricies erat. Nunc varius turpis vel vestibulum efficitur. Vestibulum elementum leo quis erat pulvinar tincidunt. Nulla eget purus ultrices, vehicula massa quis, fringilla ex. Nam tincidunt finibus quam id laoreet. Maecenas ac eleifend' +
      'lectus. Proin porttitor mi vel mauris vulputate, ac accumsan ex eleifend. Pellentesque venenatis magna justo, eget volutpat dolor pretium eget. Aliquam vitae velit in nulla posuere dictum. Aenean commodo, magna quis molestie maximus, lectus lorem' +
      'iaculis velit, nec pharetra justo erat tincidunt augue. Vestibulum pharetra erat et volutpat luctus. Sed purus nibh, semper ac vulputate ac, aliquam in erat. Aenean sagittis mi vitae lectus semper congue. Morbi rhoncus in justo at accumsan. Nulla' +
      'euismod velit in dolor egestas, et dapibus sem ultricies. Integer ultrices tortor pellentesque luctus molestie. Nulla eu vestibulum ipsum. Mauris eget porttitor libero, vitae egestas lorem. Cras sed ex et sem porta consequat. Ut rutrum massa elementum,' +
      'feugiat neque eu, tincidunt velit. Proin imperdiet quam in pulvinar feugiat. Quisque condimentum mauris nec interdum efficitur. Aenean mollis congue nibh, ac feugiat odio egestas nec. Maecenas et dolor sed sapien iaculis condimentum quis ac ante.' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras feugiat porttitor quam. Vestibulum tempor sem eros, sed volutpat elit pellentesque luctus. Pellentesque fermentum at metus quis blandit. Phasellus vulputate id justo sit amet pretium. In' +
      'porta, nulla vel semper porttitor, felis odio commodo ipsum, at sodales nisi lacus id velit. Vivamus porta gravida ex, vel fringilla turpis aliquam id. Donec et cursus neque, ut elementum enim. Praesent elementum arcu dapibus ipsum dapibus, vehicula' +
      'tristique nulla sagittis. Praesent feugiat nibh felis, non tristique libero sodales at. Praesent lacus sapien, scelerisque sed lorem sit amet, scelerisque aliquet turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id bibendum' +
      'libero, id sagittis elit. Aliquam erat volutpat. Quisque pretium maximus euismod. In vel quam justo. Maecenas a elementum turpis. Etiam nec laoreet leo, a malesuada erat. Pellentesque efficitur justo sed cursus pulvinar. Suspendisse scelerisque viverra' +
      'nisl, vitae feugiat arcu pellentesque et. In odio sem, tristique eget felis vitae, gravida vulputate augue. Praesent facilisis quam vestibulum ipsum ornare auctor quis in libero.' +
      '</p>' +
      '</div>';

    var template2 = '<div>' +
      '<button class="btn btn-primary" ng-click="closePanel()">Close Me</button>' +
      '<button class="btn btn-primary" ng-click="openInnerPanel()">Open Inner Panel</button>' +
      '</div>';

    var template3 = '<div>' +
      '<button class="btn btn-primary" ng-click="closePanel()">Close Me</button>' +
      '</div>';

    $scope.openPanelLeft = function () {
      var panelInstance1 = angularSlideOutPanel.open({
        template: template1,
        openOn: 'left',
        controller: [
          '$scope',
          'user',
          modalController
        ],
        panelClass: 'foobar',
        resolve: {
          user: [
            function () {
              return {
                firstName: 'Jerry'
              };
            }
          ]
        }
      });

      panelInstance1.result
        .then(function (result) {
          console.log('panel was closed with result : ', result);
        }).catch(function (error) {
          console.log('panel was rejected with error : ', error);
        });
    };

    $scope.openPanelRight = function () {
      var panelInstance2 = angularSlideOutPanel.open({
        template: template1,
        openOn: 'right',
        backdrop: 'static',
        controller: [
          '$scope',
          'user',
          modalController
        ],
        resolve: {
          user: [
            function () {
              return {
                firstName: 'Jerry'
              };
            }
          ]
        }
      });

      panelInstance2.result
        .then(function (result) {
          console.log('panel was closed with result : ', result);
        }).catch(function (error) {
          console.log('panel was rejected with error : ', error);
        });
    };

    function modalController($scope, user) {
      $scope.closePanel = function () {
        $scope.$panelInstance.close('this is from the controller!!');
      };

      $scope.dismissPanel = function () {
        $scope.$panelInstance.dismiss('this is from the controller!!');
      };

      $scope.openInnerPanel = function () {
        angularSlideOutPanel.open({
          template: template2,
          openOn: 'right',
          controller: [
            '$scope',
            function ($scope) {
              $scope.closePanel = function () {
                $scope.$panelInstance.close('this is from the controller!!');
              };

              $scope.openInnerPanel = function () {
                angularSlideOutPanel.open({
                  template: template3,
                  openOn: 'right',
                  controller: [
                    '$scope',
                    function ($scope) {
                      $scope.closePanel = function () {
                        $scope.$panelInstance.close('this is from the controller!!');
                      };
                    }
                  ]
                });
              };
            }
          ]
        });
      };

      $scope.user = user;
    }
  }
]);
