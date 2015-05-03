#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# show_oe_data.py

from flask import Flask \
        ,render_template, url_for

app = Flask(__name__)

## ------------------------------------------------------ Web parts ----- ##
@app.route("/"):
def show_national_data():
    """Show the national-level data."""
    return "hello world"


if __name__ == "__main__":
    app.run(debug=True)
