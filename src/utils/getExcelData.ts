import { join } from 'path';
import * as XLSX from 'xlsx';

export const getExcelData = () => {
  const letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
  ];

  const personalLetters = {
    A: 'personalNumber',
    B: 'firstName',
    C: 'lastName',
    D: 'status',
    E: '2012',
    F: '2013',
    G: '2014',
    H: '2015',
    I: '2016',
    J: '2017',
    K: '2018',
    L: '2019',
    M: '2020',
    N: '2021',
  };

  const data = { '1': { years: [] } };
  const list = [];

  const inputFilePath = join(__dirname, '../../Antarsia.xlsx');
  const file = XLSX.readFile(inputFilePath);
  const content = file.Sheets[file.SheetNames[0]];
  for (let i = 1; i < 299; i++) {
    letters.forEach((letter, index) => {
      if (index <= 3) {
        data[i] = {
          ...data[i],
          [personalLetters[letter]]: content[`${letter}${i}`]?.v,
        };
      } else {
        if (data[i].years) {
          data[i]['years'].push({
            year: personalLetters[letter],
            value: content[`${letter}${i}`]?.v,
          });
        } else {
          data[i]['years'] = [
            {
              year: personalLetters[letter],
              value: content[`${letter}${i}`]?.v,
            },
          ];
        }
      }
    });
    list.push(data[i]);
  }
  return list;
};
