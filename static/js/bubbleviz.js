var Bubble = function(terms = [], titles = [], data = [], shape = "bubble", bubbleColor = "lightblue", target="bubble", bubbleBorderColor="black", bubbleBorderThickness="1px") {
    this.bubbleBorderColor = bubbleBorderColor;
    this.bubbleBorderThickness = bubbleBorderThickness;
    this.bubbleColor = bubbleColor;
    this.shape = shape;
    this.terms = terms;
    this.titles = titles;
    this.target = target;
    this.data = data;

    this.from_json = function(json_object) {
        // rewrites titles, terms, and data from a json object
        this.json = json_object;
        this.data = [];
        this.titles = [];
        //this.all_terms = [];
        this.terms = [];
        for (i=0; i < this.json.values.length; i++) {
        	values = []

          this.titles.push(this.json.values[i].title);
          for (y=0; y < this.json.values[i].data.length; y++) {
            if (i==0)
              {
                this.terms.push(this.json.values[i].data[y].term)
              }
            //this.all_terms.push(this.json.values[i].data[y].term);
            values.push(this.json.values[i].data[y].count);
          }
          this.data.push(values);

          //assumes correct order and parallel lists of terms

        }
        this.t = new Set(this.all_terms);
        //this.terms = Array.from(this.t);
    };

    this.flattenData = function() {
        var data = this.data
        var flat = [];
        for (i = 0; i < data.length; i++) {
            for (j = 0; j < data[i].length; j++) {
                flat.push(data[i][j]);
            }
        }
        this.flat = flat;
    };

    this.scaleScores = function() {
        this.flattenData();
        //number of columns
        var cols = this.data.length + 1;
        this.cols = cols;
        d = this.flat.sort();
        //number of items
        itemNum = d.length;
        //max
        var max = d[d.length - 1];
        //min
        var min = d[0];
        scaled_data = [];
        for (z = 0; z < this.data.length; z++) {

            scaled_set = [];
            for (y = 0; y < this.data[z].length; y++) {
                var s = this.data[z][y] * (100 / cols) / max;
                scaled_set.push(s);
            }
            scaled_data.push(scaled_set);
        }
        this.scaled = scaled_data;
    };

    this.makeBubbleTable = function () {
        this.scaleScores();
        var table = document.createElement("table");
        table.setAttribute("class", "table");
        var thead = document.createElement("thead");
        var head_tr = document.createElement("tr");
        var head_w_cells = this.makeBubbleHead(head_tr);
        var tbody = document.createElement("tbody");
        var body_trs = this.makeBubbleCells(tbody);


        //var cells_styled = this.makeBubbleStyles(cells);
        thead.appendChild(head_tr);
        table.appendChild(thead);
        table.appendChild(body_trs);
        this.table = table;
        document.getElementById(this.target).appendChild(this.table);

  };
    this.makeBubbleHead = function (head_tr) {
        var empty_th = document.createElement("th");
        empty_th.innerHTML = " "
        head_tr.appendChild(empty_th);

        for (i = 0; i < this.titles.length; i++) {
            var one_th = document.createElement("th");
            if (this.shape =="hbar") {
              one_th.style.textAlign = "left";

            }
            one_th.innerHTML = this.titles[i];
            head_tr.appendChild(one_th);
        }
        return head_tr
  };
    this.makeBubbleCells = function (tbody) {

        for (y = 0; y < this.scaled[0].length; y++) {
            var tr = document.createElement("tr");
            var th_row = document.createElement("th");
            th_row.innerHTML = this.terms[y];
            th_row.setAttribute("scope", "row");
            if (this.shape =="vbar") {
              th_row.style.verticalAlign = "bottom";
              th_row.style.height = 100/this.cols +"vh";
            }

            tr.appendChild(th_row);

            for (z = 0; z < this.scaled.length; z++) {
                var data_td = document.createElement("td");
                data_td.setAttribute("class", "data");
                //data_td.style.width = 100/this.cols +"vh";
                if (this.shape =="vbar") {
                  data_td.style.verticalAlign = "bottom";
                  data_td.style.height = 100/this.cols +"vh";
                }
                var size = this.scaled[z][y];
                var inner_div = document.createElement("div");
                var b_id = 'bubble_' + z + "_" + y;
                inner_div.setAttribute("class", "bubble");
                inner_div.setAttribute("id", b_id);
                inner_div = this.makeBubbleStyles(inner_div, size);
                //set other css here ... but use the css method "height:", size, "width:"
                data_td.appendChild(inner_div);
                tr.appendChild(data_td);
            }
            tbody.appendChild(tr);
        }
        return tbody;
  };
    this.makeBubbleStyles = function (inner_div, size) {

        if (this.shape == "bubble") {
          inner_div.style.borderRadius = size+"vh";
          inner_div.style.height = size+"vh";
          inner_div.style.width = size+"vh";
          inner_div.style.margin = "auto";
        }
        if (this.shape == "square") {
          inner_div.style.borderRadius = 0;
          inner_div.style.height = size+"vh";
          inner_div.style.width = size+"vh";
          inner_div.style.margin = "auto";
        }
        if (this.shape == "hbar") {
          inner_div.style.borderRadius = 0;
          inner_div.style.height = 100/this.cols/4 +"vh";
          inner_div.style.width = size +"vh";
          inner_div.style.margin = "0";

        }
        if (this.shape == "vbar") {
          inner_div.style.borderRadius = 0;
          inner_div.style.height = size +"vh";
          inner_div.style.width = 100/this.cols/4 +"vh";

        }
        inner_div.style.border = this.bubbleBorderThickness + " solid " + this.bubbleBorderColor;
        inner_div.style.backgroundColor = this.bubbleColor;

        return inner_div
  };
};
