define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/page.html',
  'jscssp',
  'config',
  'pagedown',
  'libs/marked/marked',
  'libs/highlight/highlight',
  'libs/parseuri/parseuri',
  'libs/waypoints/waypoints'
], function($, _, Backbone, stylePageTemplate, jscssp, config, Pagedown, marked, hljs, parseuri, waypoints){
  var StylePage = Backbone.View.extend({
    el: '.kalei-style-page',
    render: function () {
      var that = this;
        $('a.kalei-styleguide-menu-link').removeClass('active');
        $('[href="' + window.location.hash + '"]').addClass('active');
        if(window.location.hash === '') {
          $('.js-kalei-home').addClass('active');
        }
      $('head').append('<link rel="stylesheet" href="' + config.css_path + '"" type="text/css" />');
      var converter = new Pagedown.Converter();
      var that = this;
      var styleUrl;
      if(this.options.style === null) {
        this.options.style = config.css_path.substr(config.css_path.lastIndexOf('/')+1);
      }
      if(this.options.style.substr(0,1) === '/') {
        // non relative
        var configDir = config.css_path.substr(0, config.css_path.lastIndexOf('/'));
        var pUrl = parseuri(configDir);
        styleUrl = pUrl.protocol + '://' + pUrl.host + (pUrl.port === '' ? '' : ':'+ pUrl) + this.options.style;
      } else {
        var configDir = config.css_path.substr(0, config.css_path.lastIndexOf('/'));
        styleUrl = configDir + '/' + this.options.style;
      }
      console.log('try', styleUrl)
		 require(['text!'+ styleUrl], function (stylesheet){
        var parser = new jscssp();
        marked.setOptions({ sanitize: false, gfm: true });
        var stylesheet = parser.parse(stylesheet, false, true);
        var blocks = [];
        var firstBlock = true;
        var currentBlock = {
          comments: [],
          css: ''
        };
        var includeNextCSS = false;
        var headings = [];

        _.each(stylesheet.cssRules, function(rule) {

          if (includeNextCSS && rule.type != 101) {
            currentBlock.comments.push({
              type: 'code',
              text: rule.parsedCssText
            });
          }

    			if(rule.type === 101) {
    			  var comment = rule.parsedCssText;
            comment = comment.replace('/*', '');
            comment = comment.replace('*/', '');

            if (comment.indexOf("@include start") !== -1) {
              includeNextCSS = true;
            }
            else if (comment.indexOf("@include end") !== -1) {
              includeNextCSS = false;
            }
            else {
              var comments = marked.lexer(comment);
              _.each(comments, function (comment) {

                if(comment.type === 'heading' && comment.depth == 1 && !firstBlock) {
                  headings.push(comment.text);
                  currentBlock.css = css_beautify(currentBlock.css);
                  if(currentBlock.comments.length !== 0 || currentBlock.css !== '') {
                    currentBlock.comments = marked.parser(currentBlock.comments);
                    blocks.push(_.extend({}, currentBlock));
                    currentBlock.comments = [];
                    currentBlock.css = '';
                  }
                }

                if(comment.type === 'heading' && comment.depth == 1) {
                  firstBlock = false;
                }

                if(comment.type === 'code'){
                  currentBlock.comments.push({
                    type: 'html',
                    text: '<div class="codedemo">' + comment.text + '<div style="clear: both;"></div></div>'
                  })
                };
                currentBlock.comments.push(comment);

              });
            }
    			}
          if(rule.type === 1) {
            currentBlock.css += rule.parsedCssText;
          }

          if(rule.type === 3) {
            currentBlock.comments.push({
              type: 'pre',
              text: rule.parsedCssText
            });

          }

		    });
        $('.sheet-submenu').hide();
        $('.kalei-styleguide-menu .sheet-submenu:first-child').show();
        currentBlock.css = css_beautify(currentBlock.css);
        var submenu = $('<ul>');
        _.each(headings, function (heading) {
          submenu.append($('<li>').text(heading));
        });
        $('li:first-child', submenu).addClass('active');
        $('.sheet-submenu', $('[data-sheet="' + that.options.style + '"]')).html(submenu).slideDown(200);
        currentBlock.comments = marked.parser(currentBlock.comments);
        blocks.push(currentBlock);
        $(that.el).html(_.template(stylePageTemplate, {_:_, blocks: blocks, config: config}));
        $(' code').each(function(i, e) {hljs.highlightBlock(e); });

        $('.kalei-comments-container > .kalei-comments > h2, .kalei-comments-container > .kalei-comments  > h1').waypoint(function(ev) {
          console.log(arguments);
         $('.sheet-submenu li').removeClass('active');
           $('.sheet-submenu li:contains('+$(ev.currentTarget).text()+')').addClass('active');
        }, {
   offset: 20  // middle of the page
});

        $("body").on('click', '.sheet-submenu li', function(ev) {

             $('html, body').animate({
                 scrollTop: $(".kalei-comments h3:contains('"+$(ev.currentTarget).text()+"'),.kalei-comments h2:contains('"+$(ev.currentTarget).text()+"')").offset().top - 20
             }, 200);
         });

         fixie.init();

      });


    }
  });
  return StylePage;
});
