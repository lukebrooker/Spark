define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/menu.html',
  'jscssp',
  'config',
  'libs/marked/marked',
], function($, _, Backbone, dashboardPageTemplate, jscssp, config){
  var DashboardPage = Backbone.View.extend({
    el: '.kalei-style-menu',
    render: function () {
      var that = this;
      that.$el.html('Loading styles');
      console.log(config.css_path);
      require(['text!' + config.css_path], function (styles) {

      var masterStyle = config.css_path.substr(config.css_path.lastIndexOf('/')+1);


      var parser = new jscssp();
        marked.setOptions({ sanitize: false, gfm: true });
        var stylesheet = parser.parse(styles, false, true);
        var menuTitle = '';
        var categories = [];
        var currentCategory = 0;
        var currentCategoryItem = 0;

        _.each(stylesheet.cssRules, function(rule) {

          if(rule.type === 101) {
            var comment = rule.parsedCssText;
            comment = comment.replace('/*', '');
            comment = comment.replace('*/', '');

            var comments = marked.lexer(comment);
            _.each(comments, function (comment) {

              if(comment.type === 'heading' && comment.depth === 1 && menuTitle == '') {
                menuTitle = marked.parser([comment]);

              }
              else if(comment.type === 'heading' && comment.depth === 2 && menuTitle != '') {
                currentCategory++;
                categories[currentCategory] = [];
                categories[currentCategory].catTitle = comment.text;
                categories[currentCategory].catItems = [];
                currentCategoryItem = 0;
              }
              else if(comment.type === 'heading' && comment.depth === 3) {
                categories[currentCategory].catItems[currentCategoryItem] = comment.text;
                currentCategoryItem++;
              }

            });

          }

        });


        $(that.el).html(_.template(dashboardPageTemplate, {_:_, menuTitle: menuTitle, categories: categories, entry: masterStyle}));
        $('[href="' + window.location.hash + '"]').addClass('active');
        if(window.location.hash === '') {
          $('.js-kalei-home').addClass('active');
        }
      });

    },
    events: {
      'click a.kalei-styleguide-menu-link': function (ev) {
        ev.preventDefault();
        this.$el.find('a.active').removeClass('active').next('.sheet-submenu').slideUp(200);
        $(ev.currentTarget).addClass('active').next('.sheet-submenu').slideDown(200);
      },
      'click a.kalei-menu-toggle': function (ev) {
        ev.preventDefault();
        $('body').toggleClass('kalei-nav--is-active');
      }
    }
  });
  return DashboardPage;
});
