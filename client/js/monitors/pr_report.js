
$(function() {

    var OVERDUE_GAP = 7 * 24 * 60 * 60 * 1000
      , validateUrl = "http://issues.numenta.org:8081/validate";

    function initialize(id, config, server, template) {
        server.get('pulls', null, function(prs) {
            var now = new Date().getTime()
              , overdueCount = 0
              ;

            prs.sort(function(a, b) {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }).forEach(function(pr) {
                if ((now - new Date(pr.created_at).getTime()) > OVERDUE_GAP) {
                    pr.overdue = true;
                    overdueCount++;
                }
                pr.created_at = WB.utils.timeAgo(pr.created_at);
                if (pr.builds && pr.builds.length) {
                    pr.latest_status = pr.builds[0];
                }
            });
            template({
                overdue: overdueCount
              , validateUrl: validateUrl
              , open: prs.length
              , prs: prs
            });
        });

    }

    window.WB.pr_report = initialize;

});

