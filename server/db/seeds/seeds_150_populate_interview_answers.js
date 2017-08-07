const answers = [

  {
    answer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapib.",
    question_id: '4SjQTx4oxAV', poster_id: '1RzZl22wTN9', outcome: 'Got the job', id: 'F6W3BvAOTp9'
  },
  {
    answer: "Respond by emphasizing your unique qualities and value proposition. Relate them to the position at hand whenever possible. Be prepared to back them up with accomplishments, situations where you have utilized these skills. It is important to do research online (Google company, check company website, Glass Door, and/or OneSource to speak knowledgably about the company or organization.",
    question_id: 'siqrxUsg8xU', poster_id: '1RzZl22wTN9', outcome: 'Unsuccessful', id: 'zvuAAqKsgy2'
  },
  {
    answer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a.",
    question_id: '2k8M9BZFLV0', poster_id: '1RzZl22wTN9', outcome: 'Unknown', id: 'eDG20DpaMHv'
  },

  {
    answer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.",
    question_id: 'u9GrhZPqD8C', poster_id: '1RzZl22wTN9', outcome: 'Got the job', id: 'WhqybC8CwVU'
  },
  {
    answer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringill.",
    question_id: 'ZEZ4dXEJ1W6', poster_id: '1RzZl22wTN9', outcome: 'Unsuccessful', id: 'e120KWwzP40'
  },
  {
    answer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arc.",
    question_id: 'VUvb4nKLgcj', poster_id: '1RzZl22wTN9', outcome: 'Unknown', id: 't8YmeNFnlRi'
  },

  {
    answer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu.",
    question_id: 'o7OXzkbG75F', poster_id: '1RzZl22wTN9', outcome: 'Got the job', id: '6fgly2IpQL9'
  },
  {
    answer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dic.",
    question_id: 'ZNEMuFVPFc3', poster_id: '1RzZl22wTN9', outcome: 'Unsuccessful', id: 'O9xtlJvYTTo'
  },
  {
    answer: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet.",
    question_id: '0DGWbjiudsx', poster_id: '1RzZl22wTN9', outcome: 'Unknown', id: 'ALcn4VuZbPP'
  }

];

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('interview_answers').insert(answers)
  ]);
};
