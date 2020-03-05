export default {
  qInfo: { qType: 'visualization' },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['School Name (Reporting Category)'],
          qFieldLabels: ['school_report'],
          qSortCriterias: [{ qSortByLoadOrder: 0, qSortByAscii: 1 }],
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['spr.srcschoolid'],
          qFieldLabels: ['srcschoolid'],
        },
        qNullSuppression: true
      },
      // {
      //   qDef: {
      //     qFieldDefs: ['School URL Slug'],
      //     qFieldLabels: ['slug'],
      //   },
      //   qNullSuppression: false
      // },
      {
        qDef: {
          qFieldDefs: ['spr.slug_report'],
          qFieldLabels: ['slug_report'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.schoolname'],
          qFieldLabels: ['schoolname'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.governance'],
          qFieldLabels: ['governance'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.street_address'],
          qFieldLabels: ['address'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.phonenumber'],
          qFieldLabels: ['phone'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.faxnumber'],
          qFieldLabels: ['fax'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.zip_code'],
          qFieldLabels: ['zip_code'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.url_school'],
          qFieldLabels: ['url_school'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.report_name'],
          qFieldLabels: ['report_name'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.grades_served'],
          qFieldLabels: ['grades_served'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.enrollment'],
          qFieldLabels: ['enrollment'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.admissiontype'],
          qFieldLabels: ['admissiontype'],
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['spr.turnaround'],
          qFieldLabels: ['turnaround'],
        },
        qNullSuppression: true
      },
    ],
    qMeasures: [
      {
        qDef: {
          qDef: 'Count(distinct {<YearEnd={$(=$(v_Max_YearEnd))}>} 1)',
          qLabel: 'Flag_CY'
        }
      }
    ],
    qInitialDataFetch: [{ qWidth: 20, qHeight: 500 }]
  }
}