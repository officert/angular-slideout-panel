angular.module('angular-slideout-panel').service('angularSlideOutPanelStack', [
  '$timeout',
  ($timeout) => {
    class AngularPanelStack {
      constructor() {
        this._stack = [];
      }

      add(panel) {
        if (!panel) return;

        this._stack.push(panel);
      }

      remove(panel) {
        if (!panel) return;

        let index = this._stack.indexOf(panel);

        if (index >= 0) this._stack.splice(index, 1);
      }

      pop() {
        this._stack.pop();
      }

      length() {
        return this._stack.length;
      }

      clearAll() {
        angular.forEach(this._stack, panel => {
          $timeout(() => {
            panel.close();
          }, 500);
        });
      }
    }

    return new AngularPanelStack();
  }
]);
