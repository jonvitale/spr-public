export default {
  qInfo: { qType: 'visualization' },
  qHyperCubeDef: {
    qInitialDataFetch: [
      {
        qWidth: 20,
        qHeight: 20
      }
    ],
    qDimensions: [
      {
        qDef: {
          qFieldLabels: ['relevance'],
          qFieldDefs: ['Research Tab.Relevance']
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldLabels: ['product'],
          qFieldDefs: ['Research Tab.Research Product Title']
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldLabels: ['link'],
          qFieldDefs: ['Research Tab.Research Product ORE Website link']
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldLabels: ['date'],
          qFieldDefs: ['Research Tab.Published date(Month year)']
        },
        qNullSuppression: false
      },
      {
        qDef: { qFieldLabels: ['type'], qFieldDefs: ['Research Tab.Type'] },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldLabels: ['authors'],
          qFieldDefs: ['Research Tab.Authors']
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldLabels: ['abstract'],
          qFieldDefs: ['Research Tab.Abstract']
        },
        qNullSuppression: false
      }
    ]
  }
}
