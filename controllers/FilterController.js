const categoryService = require('../services/CategoryService');

const getFilterArticle = async (req, res) => {
  try {
    //data categories
    const categories = await categoryService.getAllCategories();
    const categoriesSelect = [
      {
        "label": "Semua Kategori",
        "value": "000all"
      }
    ];

    categories.map((res) => {
      categoriesSelect.push({label: res.name, value: res._id});
    });

    //data sort
    const sort = [
      {
        "label": "Relevansi",
        "value": "0"
      },
      {
        "label": "Terbaru",
        "value": "1"
      },
      {
        "label": "Terlama",
        "value": "2"
      }
    ];

    //data time
    const time = [
      {
        "label": "Semua Waktu",
        "value": "0"
      },
      {
        "label": "Hari Ini",
        "value": "1"
      },
      {
        "label": "Kemarin",
        "value": "2"
      },
      {
        "label": "Minggu Ini",
        "value": "3"
      },
      {
        "label": "Pilih Tanggal",
        "value": "4"
      }
    ];

    const filter = [
      {
        "id": "filKat",
        "title": "Kategori",
        "options": categoriesSelect
      },
      {
        "id": "filSort",
        "title": "Urutkan",
        "options": sort
      },
      {
        "id": "filTime",
        "title": "Waktu",
        "options": time
      }
    ];

    res.json({data: filter, status: 'success'});
  } catch (err) {
    res.status(500).json({error: err.message, line: err.lineNumber});
  }
};

module.exports = {
  getFilterArticle
};