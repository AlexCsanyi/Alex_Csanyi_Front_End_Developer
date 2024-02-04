import { generate } from 'critical';

generate({
  inline: true,
  base: './',
  src: 'main.html',
  target: 'index.html',
  width: 1300,
  height: 900,
});
