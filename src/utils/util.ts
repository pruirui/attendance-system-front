export const extractColorByName = (name: String) => {
  var temp = [];
  temp.push("#");
  for (let cha of name) {
    let unicode = cha.charCodeAt(0).toString();
    temp.push(parseInt(unicode, 10).toString(16));
  }
  return temp.slice(0, 5).join("").slice(0, 4);
};


export const regions = [
  {
      value: '广东省',
      label: '广东省',
      children: [
          {
              value: '广州市',
              label: '广州市',
              children: [
                  {
                      value: '天河区',
                      label: '天河区',
                  },
                  {
                      value: '海珠区',
                      label: '海珠区',
                  },
              ],
          },
          {
              value: '东莞市',
              label: '东莞市',
              children: [
                  {
                      value: '长安镇',
                      label: '长安镇',
                  },
                  {
                      value: '虎门镇',
                      label: '虎门镇',
                  },
              ],
          },
      ],
  },
  {
      value: '湖南省',
      label: '湖南省',
      children: [
          {
              value: '长沙市',
              label: '长沙市',
              children: [
                  {
                      value: '岳麓区',
                      label: '岳麓区',
                  },
              ],
          },
      ],
  },
];