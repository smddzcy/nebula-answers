"use strict";

var AnswerData = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.question = obj.question;
        this.answer = obj.answer;
        this.author = obj.author;
    } else {
        this.question = "";
        this.answer = "";
        this.author = "";
    }
};

AnswerData.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var Answer = function () {
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return new AnswerData(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Answer.prototype = {
    init: function () {

    },

    save: function (question, answer) {
        // checks
        if (!question || !answer) {
            throw new Error("Question/answer can't be empty.");
        }
        if (question.length > 200 || answer.length > 200) {
            throw new Error("Question/answer is too long.");
        }
        if (this.data.get(question)) {
            throw new Error("There is already an answer to this question.");
        }

        // put the data inside the answer
        var data = new AnswerData();
        data.author = Blockchain.transaction.from;
        data.question = question;
        data.answer = answer;
        this.data.put(question, data);
    },

    get: function (question) {
        if (!question) {
            throw new Error("Question can't be empty.");
        }
        return this.data.get(question);
    }
};

module.exports = Answer;