export default {
  qInfo: { qType: 'visualization' },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['Year'],
          qFieldLabels: ['Year']
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['YearEnd'],
          qFieldLabels: ['YearEnd']
        },
        qNullSuppression: true
      }
    ],
    qInitialDataFetch: [{ qWidth: 2, qHeight: 100 }]
  }
}
