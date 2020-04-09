export default {
  qInfo: { qType: 'visualization' },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['School Name (Reporting Category)'],
          qFieldLabels: ['schoolReport'],
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
          qFieldLabels: ['slugReport'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.schoolname'],
          qFieldLabels: ['schoolName'],
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
          qFieldLabels: ['zipCode'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.url_school'],
          qFieldLabels: ['urlSchool'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.report_name'],
          qFieldLabels: ['reportName'],
        },
        qNullSuppression: false
      },
      {
        qDef: {
          qFieldDefs: ['spr.grades_served'],
          qFieldLabels: ['gradesServed'],
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
          qFieldLabels: ['admissionType'],
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