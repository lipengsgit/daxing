export const queryResources = (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        name: '一级',
        url: '/test',
        sequence: 12,
        pname: '',
        children: [
          {
            id: 2,
            name: '一级',
            url: '/test',
            sequence: 12,
            pname: '',
          },
        ],
      },
    ]
  });
};
