{"filter":false,"title":"13.sql","tooltip":"/pset7/movies/13.sql","undoManager":{"mark":22,"position":22,"stack":[[{"start":{"row":0,"column":0},"end":{"row":5,"column":23},"action":"insert","lines":["SELECT count(DISTINCT name) FROM people JOIN stars ON","people.id=stars.person_id ","WHERE movie_id IN(SELECT movie_id FROM stars","JOIN people ON ","stars.person_id=people.id WHERE people.name=’Kevin Bacon’and people.birth = 1958)","and name != ‘Kevin Baco"],"id":1}],[{"start":{"row":0,"column":53},"end":{"row":1,"column":0},"action":"remove","lines":["",""],"id":2}],[{"start":{"row":0,"column":53},"end":{"row":0,"column":54},"action":"insert","lines":[" "],"id":3}],[{"start":{"row":0,"column":80},"end":{"row":1,"column":0},"action":"remove","lines":["",""],"id":4}],[{"start":{"row":1,"column":15},"end":{"row":2,"column":0},"action":"remove","lines":["",""],"id":5}],[{"start":{"row":1,"column":96},"end":{"row":2,"column":0},"action":"remove","lines":["",""],"id":6}],[{"start":{"row":0,"column":124},"end":{"row":1,"column":0},"action":"remove","lines":["",""],"id":7}],[{"start":{"row":0,"column":232},"end":{"row":0,"column":233},"action":"remove","lines":["‘"],"id":8}],[{"start":{"row":0,"column":232},"end":{"row":0,"column":233},"action":"insert","lines":["\""],"id":9}],[{"start":{"row":0,"column":243},"end":{"row":0,"column":244},"action":"insert","lines":["\""],"id":10}],[{"start":{"row":0,"column":243},"end":{"row":0,"column":244},"action":"remove","lines":["\""],"id":11},{"start":{"row":0,"column":242},"end":{"row":0,"column":243},"action":"remove","lines":["o"]}],[{"start":{"row":0,"column":242},"end":{"row":0,"column":243},"action":"insert","lines":["o"],"id":12},{"start":{"row":0,"column":243},"end":{"row":0,"column":244},"action":"insert","lines":["n"]},{"start":{"row":0,"column":244},"end":{"row":0,"column":245},"action":"insert","lines":["\""]}],[{"start":{"row":0,"column":245},"end":{"row":0,"column":246},"action":"insert","lines":[";"],"id":13}],[{"start":{"row":0,"column":183},"end":{"row":0,"column":184},"action":"remove","lines":["’"],"id":14}],[{"start":{"row":0,"column":183},"end":{"row":0,"column":184},"action":"insert","lines":["\""],"id":15}],[{"start":{"row":0,"column":195},"end":{"row":0,"column":196},"action":"remove","lines":["’"],"id":16}],[{"start":{"row":0,"column":195},"end":{"row":0,"column":196},"action":"insert","lines":["\""],"id":17}],[{"start":{"row":0,"column":196},"end":{"row":0,"column":197},"action":"insert","lines":[" "],"id":18}],[{"start":{"row":0,"column":221},"end":{"row":0,"column":222},"action":"insert","lines":[" "],"id":19}],[{"start":{"row":0,"column":124},"end":{"row":0,"column":125},"action":"insert","lines":[" "],"id":20}],[{"start":{"row":0,"column":7},"end":{"row":0,"column":27},"action":"remove","lines":["count(DISTINCT name)"],"id":21},{"start":{"row":0,"column":7},"end":{"row":0,"column":8},"action":"insert","lines":["n"]},{"start":{"row":0,"column":8},"end":{"row":0,"column":9},"action":"insert","lines":["s"]},{"start":{"row":0,"column":9},"end":{"row":0,"column":10},"action":"insert","lines":["m"]}],[{"start":{"row":0,"column":9},"end":{"row":0,"column":10},"action":"remove","lines":["m"],"id":22},{"start":{"row":0,"column":8},"end":{"row":0,"column":9},"action":"remove","lines":["s"]}],[{"start":{"row":0,"column":8},"end":{"row":0,"column":9},"action":"insert","lines":["a"],"id":23},{"start":{"row":0,"column":9},"end":{"row":0,"column":10},"action":"insert","lines":["m"]},{"start":{"row":0,"column":10},"end":{"row":0,"column":11},"action":"insert","lines":["e"]}],[{"start":{"row":0,"column":0},"end":{"row":0,"column":233},"action":"remove","lines":["SELECT name FROM people JOIN stars ON people.id=stars.person_id WHERE movie_id IN(SELECT movie_id FROM stars JOIN people ON stars.person_id=people.id WHERE people.name=\"Kevin Bacon\" and people.birth = 1958) and name != \"Kevin Bacon\";"],"id":24},{"start":{"row":0,"column":0},"end":{"row":0,"column":249},"action":"insert","lines":["SELECT count(DISTINCT name) FROM people JOIN stars ON people.id=stars.person_id WHERE movie_id IN(SELECT movie_id FROM stars JOIN people ON stars.person_id=people.id WHERE people.name=\"Kevin Bacon\" and people.birth = 1958) and name != \"Kevin Bacon\";"]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":0},"end":{"row":0,"column":233},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1606914096684,"hash":"186f7d13ae5bd40bc412ddc96cacfa4b19643f51"}