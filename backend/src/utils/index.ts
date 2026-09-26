import type { questionType } from "../types";

export const questions: questionType[] = [
  {
    id: 1,
    text: "What is the capital of Nigeria?",
    answer: "Abuja",
    options: [
      {
        id: "c09253c3-ce68-49b1-92df-0a3925e62a03",
        text: "Ibadan",
      },
      {
        id: "9e901ac1-86d8-4ff2-b68e-67ac5375d248",
        text: "Kano",
      },
      {
        id: "abff85f2-85ef-47aa-861b-695b696a7339",
        text: "Abuja",
      },
      {
        id: "8048cb86-8e28-48e1-9f9b-eb3c104efeee",
        text: "Lagos",
      },
    ],
  },
  {
    id: 2,
    text: "What is 5 + 7?",
    answer: "12",
    options: [
      {
        id: "bfcd3a54-b9aa-4411-9d46-25906bf46ab0",
        text: "13",
      },
      {
        id: "eca0000d-37ea-4be1-89f2-59ae855d0c50",
        text: "12",
      },
      {
        id: "fd07c7ed-8ef1-4816-b2bd-5c9271cd3067",
        text: "11",
      },
      {
        id: "752cbc43-6423-4be6-b453-4c78237e76fb",
        text: "10",
      },
    ],
  },
  {
    id: 3,
    text: "Which planet is known as the Red Planet?",
    answer: "Mars",
    options: [
      {
        id: "9ca1d152-73bc-47a3-ba7e-422ef7a375ec",
        text: "Venus",
      },
      {
        id: "bc79abbf-2cda-4321-927a-c25ec2dd8cd6",
        text: "Jupiter",
      },
      {
        id: "d5574fb9-7df4-4af3-b642-ed87fd0fe2f0",
        text: "Mars",
      },
      {
        id: "2cce14b1-5548-4633-88e9-bcd9ef46403d",
        text: "Earth",
      },
    ],
  },
  // {
  //   id: 4,
  //   text: "Which language runs in a web browser?",
  //   answer: "JavaScript",
  //   options: [
  //     {
  //       id: "675971c8-4157-4712-a253-31618eaf82bc",
  //       text: "C++",
  //     },
  //     {
  //       id: "da2d5660-b339-4d19-92e5-b6424b811348",
  //       text: "JavaScript",
  //     },
  //     {
  //       id: "b50bba30-b29d-4060-be44-2801c0122b8e",
  //       text: "Java",
  //     },
  //     {
  //       id: "053cf98a-108c-4f64-8984-187b20da24fa",
  //       text: "Python",
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   text: "What does HTML stand for?",
  //   answer: "HyperText Markup Language",
  //   options: [
  //     {
  //       id: "b67771ce-9d02-4606-a801-c8f80caa5c89",
  //       text: "Home Tool Markup Language",
  //     },
  //     {
  //       id: "de7234d3-58b6-4a53-a590-a61b6e97bdfb",
  //       text: "Hyperlink Text Management Language",
  //     },
  //     {
  //       id: "d5fa26cc-a63e-4e0b-9422-22b0788c7a98",
  //       text: "HighText Machine Language",
  //     },
  //     {
  //       id: "19dbee95-c337-45f0-906c-f32e87284029",
  //       text: "HyperText Markup Language",
  //     },
  //   ],
  // },
  // {
  //   id: 6,
  //   text: "How many continents are there?",
  //   answer: "7",
  //   options: [
  //     {
  //       id: "25b33657-905a-4ed4-a369-4dc3c9c0ecca",
  //       text: "8",
  //     },
  //     {
  //       id: "199cb8ca-d516-472a-b742-a23c035b6571",
  //       text: "7",
  //     },
  //     {
  //       id: "4b8edf47-c5f1-48c0-bb6f-0b834927017a",
  //       text: "6",
  //     },
  //     {
  //       id: "24669716-bbd9-4885-b9a4-3251df85154f",
  //       text: "5",
  //     },
  //   ],
  // },
  // {
  //   id: 7,
  //   text: "Which ocean is the largest?",
  //   answer: "Pacific Ocean",
  //   options: [
  //     {
  //       id: "e30c122a-dd8c-4f9b-a2c4-70d97db96787",
  //       text: "Arctic Ocean",
  //     },
  //     {
  //       id: "a10f8fd5-92b4-4c7a-9594-cc648e7744ae",
  //       text: "Pacific Ocean",
  //     },
  //     {
  //       id: "a336afa8-d990-41c2-9377-803b0a02df38",
  //       text: "Indian Ocean",
  //     },
  //     {
  //       id: "52ff7b4b-ea77-4b69-9db1-ec3b8580fbf6",
  //       text: "Atlantic Ocean",
  //     },
  //   ],
  // },
  // {
  //   id: 8,
  //   text: "What is the chemical symbol for water?",
  //   answer: "H2O",
  //   options: [
  //     {
  //       id: "286e2e40-e32c-4d25-bcfe-776ba2182c0e",
  //       text: "NaCl",
  //     },
  //     {
  //       id: "9f5cba2c-c520-4187-99f0-7bfcbce67804",
  //       text: "O2",
  //     },
  //     {
  //       id: "3dc42457-aba9-487f-9465-e98e6975b50c",
  //       text: "H2O",
  //     },
  //     {
  //       id: "95bd6ce3-78de-45a1-b8fc-8de468912dbe",
  //       text: "CO2",
  //     },
  //   ],
  // },
  // {
  //   id: 9,
  //   text: "Which animal is known as the King of the Jungle?",
  //   answer: "Lion",
  //   options: [
  //     {
  //       id: "f84aff29-c57d-4e7a-bde5-4fc57c4cec6a",
  //       text: "Gorilla",
  //     },
  //     {
  //       id: "7e08aa18-14aa-4ae1-9982-4d4ded201372",
  //       text: "Elephant",
  //     },
  //     {
  //       id: "a3c52aec-01f1-4214-b42a-a338bfb60d9b",
  //       text: "Lion",
  //     },
  //     {
  //       id: "4da2803b-9cd5-4178-9513-e9d11003fa99",
  //       text: "Tiger",
  //     },
  //   ],
  // },
  // {
  //   id: 10,
  //   text: "What is the fastest land animal?",
  //   answer: "Cheetah",
  //   options: [
  //     {
  //       id: "e281733f-8b9c-467b-8c21-9cd01d038a11",
  //       text: "Leopard",
  //     },
  //     {
  //       id: "5dd4a4af-894e-4526-92b1-98b614bdf364",
  //       text: "Horse",
  //     },
  //     {
  //       id: "b35cfae0-5f88-4f0c-853f-b7af2f777cc6",
  //       text: "Cheetah",
  //     },
  //     {
  //       id: "05d6bff6-ea09-45cb-b5dd-bbcaa26c2792",
  //       text: "Lion",
  //     },
  //   ],
  // },
];
