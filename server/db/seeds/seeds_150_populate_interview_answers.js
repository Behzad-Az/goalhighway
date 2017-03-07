const answers = [

  {
    answer: "Prepare for this one by reviewing your accomplishments over the last few years that have, like most situations, taken a sometimes difficult path. This is another opportunity to point out accomplishments, conflict management, and problem-solving skills. In selecting material, pick the items most relevant to the needs of the employer who asked the question.",
    question_id: 1, answer_poster_id: 1, outcome: "Got the job"
  },
  {
    answer: "Respond by emphasizing your unique qualities and value proposition. Relate them to the position at hand whenever possible. Be prepared to back them up with accomplishments, situations where you have utilized these skills. It is important to do research online (Google company, check company website, Glass Door, and/or OneSource to speak knowledgably about the company or organization.",
    question_id: 2, answer_poster_id: 1, outcome: "Unsuccessful"
  },
  {
    answer: "Your research may have given you a sense of the work style the company believes in. Is the company highly collaborative, directive, or more authoritarian in its approach? If you don't know the company's style, keep your answer situational and refer to examples from your accomplishments that demonstrate your style. If your work style differs significantly from the organization's, you probably do not want to work there. Like many other questions, this one can be turned around: What kind of work styles are predominate in this organization?",
    question_id: 3, answer_poster_id: 1
  },

  {
    answer: "As you prepare, select 1–3 specific accomplishments that you think were most important. Identify the transferable skills, pick the accomplishment that best matches the challenges you expect to face in the new role. Read the job description for clues as to what they are looking for, e.g., innovative ideas, improved processes, or bottom-line results. If you prepare this ahead of time, this question will be much easier to answer confidently.",
    question_id: 4, answer_poster_id: 2, outcome: "Got the job"
  },
  {
    answer: "This is your Introductory Positioning Statement. This is also an opportunity to build rapport, and give the interviewer a frame of reference. Focus on what you know this employer needs, and select the most relevant material you have. Be sure this is concise and of reasonable length (no more than two minutes). Another thing to note: tie this to your personal brand or to the value you bring. Use present tense (I am, I do, etc.) in discussing what you do and the value-add you bring. Avoid giving just a chronology of the jobs you’ve held in past 10 years.",
    question_id: 5, answer_poster_id: 2, outcome: "Unsuccessful"
  },
  {
    answer: "Be prepared to give detail on the last project you led. You may not have had the title of lead; however, you may have held leadership roles in certain areas of the project. Use the SOAR framework to enhance your response. When describing the Situation, talk about why the project was started and why it was important to the organization. When describing the Obstacle, share what challenges you faced in terms of timelines, resources, and budget. As you move into describing the Actions you took on the project, be sure to give specifics on 3–5 actions (both independently and as part of. the team). Conclude with the Results of your actions and the results as they impacted the obstacles and the overall situation. Try to use an example that is relevant to the role you are interviewing for.",
    question_id: 6, answer_poster_id: 2
  },

  {
    answer: "To prepare for this question, ask yourself what are your satisfiers and dissatisfiers in the workplace. Emphasize the positives and de-emphasize the negatives; however, a clear understanding of these will help you answer the question. Example: You may be a very results-oriented person so you may need fast-paced, action-oriented role and organization. Handling details may be your strength, so a position where you can use this skill may be important to you and the employer. Again, pick the items most relevant to the needs of the employer and the position. Be prepared to talk about examples of the type of work that makes up your ideal job using the SOAR methodology.",
    question_id: 7, answer_poster_id: 3, outcome: "Got the job"
  },
  {
    answer: "The interviewer is usually looking to see if your aspirations fit the culture of the organization. This question can also be a way of gauging your level of ambition. If possible, suggest career paths that you know are realistic and reasonable for the organization. You can also turn this question around, asking your interviewer: What kind of career progress is possible? What is the typical career path for someone who has the skills and strengths we have discussed?",
    question_id: 8, answer_poster_id: 3, outcome: "Unsuccessful"
  },
  {
    answer: "Your career goals can be very personal and/or may be influenced by the organization you are working in. If your career goals were set for you by your former company or leadership, communicate that and answer specifically why that excited you, and why your former leader saw you in that career progression. If you set personal career goals, communicate those goals and the motivation behind the drive to accomplish them. Be sure and keep your examples relevant to the role you’re interviewing for. For example, if you’re interviewing for a business analyst, don’t share that your ultimate career goal is to go back to school to be a nurse.",
    question_id: 9, answer_poster_id: 3
  }

];

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('interview_answers').insert(answers)
  ]);
};
