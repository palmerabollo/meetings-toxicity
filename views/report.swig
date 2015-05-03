{% extends 'layout.swig' %}

<!-- TODO refactor layout -->

{% block body %}
    <style>
        h1 {
            text-decoration: underline;
        }
        .square-box {
            position: relative;
            width: 240px;
            overflow: hidden;
            background: #4679BD;
        }
        .square-box:before {
            content: "";
            display: block;
            padding-top: 100%;
        }
        .square-content {
            position:  absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            color: white;
        }
        .square-content div {
           display: table;
           width: 100%;
           height: 100%;
        }
        .square-content span {
            display: table-row;
            text-align: center;
            vertical-align: middle;
            color: white
        }

        ul {
            margin: 0;
            list-style-type: none;
        }

        .toxicity-level {
            {% if score.toxicity > 90 %}
            background-color: red;
            {% elseif score.toxicity > 60 %}
            background-color: orange;
            {% elseif score.toxicity > 40 %}
            background-color: orange;
            {% elseif score.toxicity > 20 %}
            background-color: green;
            {% else %}
            background-color: green;
            {% endif %}
        }

        .cost {
            background-color: gray;
            width: 160px;
        }

        .toxicity-item, .toxicity-item-ok {
            background-color: red;
            width: 60px;
            float: left;
        }

        .toxicity-item-ok {
            background-color: green;
        }

        .toxicity-item-description {
            margin-left: 1em;
            font-size: 1.5em;
        }

        li {
          clear: both;
          margin-bottom: 2em;
          padding-bottom: 1em;
          vertical-align: middle;
        }

        .small {
            font-size: 2em;
        }

        .big {
            font-size: 3em;
        }

        .x-big {
            font-size: 7em;
        }

        td {
            vertical-align: top;
        }
    </style>

    <h1>Toxicity Report</h1>

    <h2>
    {% if score.toxicity > 90 %}
    	<span style="color: red;">No brainer, reject that meeting. NOW.</span>
    {% elseif score.toxicity > 60 %}
    	Reject that meeting.
    {% elseif score.toxicity > 40 %}
    	Be careful, toxicity signs ahead.
    {% elseif score.toxicity > 20 %}
    	Seems ok, accept it.
    {% else %}
    	Accept it!
    {% endif %}
    </h2>

    <br>
    <br>

    <table>
    <tr>
      <td>
        <div class="square-box toxicity-level">
          <div class="square-content">
            <div>
              <span class="x-big">{{ score.toxicity }}</span>
              <span>Toxicity level</span>
            </div>
          </div>
        </div>

        <br>

        <div class="square-box cost">
          <div class="square-content">
            <div>
              <span class="big">{{ cost.attendees * cost.hours * 55 }}</span>
              <span>Cost in euros</span>
            </div>
          </div>
        </div>
      </td>
      <td>
        <ul>
        {% for factor in score.factors %}
        	<li>
            <div class="square-box toxicity-item{% if factor.toxicity <= 0 %}-ok{% endif %}">
              <div class="square-content">
                <div>
                  <span class="small">{{ factor.toxicity }}</span>
                </div>
              </div>
            </div>
            <span class="toxicity-item-description">
              {{ factor.description }}
            </span>
          </li>
        {% endfor %}
        </ul>
      </td>
    </tr>
    </table>

    <!--
    <h2>Organizer: {{ event.getPropertyValue('ORGANIZER') }}</h2>

    <div class="square-box cost">
      <div class="square-content">
        <div>
          <span class="small">unknown</span>
          <span>Organizer<br>toxicity ranking</span>
        </div>
      </div>
    </div>
    -->
{% endblock %}
