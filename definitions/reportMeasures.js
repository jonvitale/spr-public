// const dimensionDefs = [
//   {label: 'name_report', field: 'School Name (Reporting Category)', nullSuppression: true},
//   // {label: 'name', field: 'School Name', nullSuppression: true},
//   // {label: 'report', field: 'SPR Report Type', nullSuppression: true},
//   {label: 'domain_name', field: 'Domain', nullSuppression: false},
//   {label: 'metric_name', field: 'Metric', nullSuppression: false},
//   {label: 'domain_id', field: 'Domain ID', nullSuppression: false},
//   {label: 'metric_id', field: 'Metric ID', nullSuppression: false},
// ]

// // create a list of spr metrics that will be made into measures

// const measureDefs = [
//   // {label: 'perc-overall', expression: '$(vMM_Only_PercScore_pMetric_pYearEnd(Z_OVERALL_OVERALL, 2018))'},
//   // {label: 'tier-overall', expression: '$(vMM_Only_Tier_pMetric_pYearEnd(Z_OVERALL_OVERALL, 2018))'}
//   {
//     label: 'perc-earned', 
//     expression: `
//       Num(
//         If([Metric ID] = 'Z_OVERALL_OVERALL', Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned Overall]),
//           If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
//             Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned in Domain]),
//             Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned for Metric])
//           )
//         )
//       , '#0%')`
//   },
//   {
//     label: 'tier', 
//     expression: `
//       If([Metric ID] = 'Z_OVERALL_OVERALL', MaxString({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Overall Tier]),
//         If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
//           MaxString({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Tier in Domain]),
//           MaxString({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Tier for Metric])
//         )
//       )`
//   },
//   {
//     label: 'perc-earned-3year', 
//     expression: `
//       Num(
//         If([Metric ID] = 'Z_OVERALL_OVERALL', 
//             RangeAvg(
//               Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned Overall]),
//               Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_Last_YearEnd))}>} [Percent Earned Overall]),
//               Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_LastLast_YearEnd))}>} [Percent Earned Overall])
//             ),
//           If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
//             RangeAvg(
//               Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned in Domain]),
//               Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Last_YearEnd))}>} [Percent Earned in Domain]),
//               Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_LastLast_YearEnd))}>} [Percent Earned in Domain])
//             ),
//             RangeAvg(
//               Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned for Metric]),
//               Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Last_YearEnd))}>} [Percent Earned for Metric]),
//               Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_LastLast_YearEnd))}>} [Percent Earned for Metric])
//             )
//           )
//         )
//       , '#0.#%')`
//   },
//   // {label: 'perc-domain', expression: `Num(Only({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned in Domain]), '#0%')`},
//   // {label: 'perc-metric', expression: `Num(Only({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned for Metric]), '#0%')`},
// ]

// const makeQlikObject = (dimensionDefs, measureDefs, maxRows) => {
//   let qDimensions = dimensionDefs.map(def => ({
//     qDef: {
//       qFieldDefs: [def.field],
//       qFieldLabels: [def.label]
//     },
//     qNullSuppression: def.nullSuppression
//   }))

//   let qMeasures = measureDefs.map(def => ({
//     qDef: {
//       qDef: def.expression,
//       qLabel: def.label
//     }
//   }))

//   return {
//     qInfo: { qType: "visualization" },
//     qHyperCubeDef: {
//       qDimensions: qDimensions,
//       qMeasures: qMeasures,
//       qInitialDataFetch: [{ 
//         qWidth: dimensionDefs.length + measureDefs.length, 
//         qHeight: Math.min( maxRows ? maxRows: 10000, Math.floor(10000 / (dimensionDefs.length + measureDefs.length)) ) 
//       }]
//     }
//   }
// }

// export default makeQlikObject(dimensionDefs, measureDefs, 500)
export default {
  qInfo: { qType: "visualization" },
    qHyperCubeDef: {
      qInitialDataFetch: [{ 
        qWidth: 20, 
        qHeight: 400 
      }],
      qDimensions: [
        {qDef: {qFieldLabels: ['name_report'], qFieldDefs: ['School Name (Reporting Category)']}, qNullSuppression: true},
        {qDef: {qFieldLabels: ['domain_name'], qFieldDefs: ['Domain']}, qNullSuppression: false},
        {qDef: {qFieldLabels: ['metric_name'], qFieldDefs: ['Metric']}, qNullSuppression: false},
        {qDef: {qFieldLabels: ['domain_id'], qFieldDefs: ['Domain ID']}, qNullSuppression: false},
        {qDef: {qFieldLabels: ['metric_id'], qFieldDefs: ['Metric ID']}, qNullSuppression: false},
      ],
      qMeasures: [
        // {label: 'perc-overall', expression: '$(vMM_Only_PercScore_pMetric_pYearEnd(Z_OVERALL_OVERALL, 2018))'},
        // {label: 'tier-overall', expression: '$(vMM_Only_Tier_pMetric_pYearEnd(Z_OVERALL_OVERALL, 2018))'}
        {
          qDef: {
            qLabel: 'perc-earned', 
            qDef: `Num(
                If([Metric ID] = 'Z_OVERALL_OVERALL', Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned Overall]),
                  If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
                    Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned in Domain]),
                    Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned for Metric])
                  )
                )
              , '#0%')`
          }
        },
        {
          qDef: {
            qLabel: 'perc-earned-py', 
            qDef: `Num(
                If([Metric ID] = 'Z_OVERALL_OVERALL', Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_Last_YearEnd))}>} [Percent Earned Overall]),
                  If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
                    Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Last_YearEnd))}>} [Percent Earned in Domain]),
                    Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Last_YearEnd))}>} [Percent Earned for Metric])
                  )
                )
              , '#0%')`
          }
        },
        {
          qDef: {
            qLabel: 'perc-earned-ppy', 
            qDef: `Num(
                If([Metric ID] = 'Z_OVERALL_OVERALL', Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_LastLast_YearEnd))}>} [Percent Earned Overall]),
                  If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
                    Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_LastLast_YearEnd))}>} [Percent Earned in Domain]),
                    Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_LastLast_YearEnd))}>} [Percent Earned for Metric])
                  )
                )
              , '#0%')`
          }
        },
        {
          qDef: {
            qLabel: 'tier', 
            qDef: `If([Metric ID] = 'Z_OVERALL_OVERALL', MaxString({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Overall Tier]),
                If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
                  MaxString({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Tier in Domain]),
                  MaxString({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Tier for Metric])
                )
              )`
          }
        },
        {
          qDef: {
            qLabel: 'exception_name', 
            qDef: `If([Metric ID] = 'Z_OVERALL_OVERALL', MaxString({<[Exception Overall] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Exception Name]),
                If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
                  MaxString({<[Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"},  [Exception in Domain] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Exception Name]),
                  MaxString({<[Exception for Metric] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Exception Name])
                )
              )`
          }
        },
        {
          qDef: {
            qLabel: 'exception', 
            qDef: `If([Metric ID] = 'Z_OVERALL_OVERALL', Max({<[Exception Overall] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Exception Overall]),
                If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
                  Max({<[Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"},  [Exception in Domain] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Exception in Domain]),
                  Max({<[Exception for Metric] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Exception for Metric])
                )
              )`
          }
        },
        {
          qDef: {
            qLabel: 'perc-earned-3year', 
            qDef: `Num(
                If([Metric ID] = 'Z_OVERALL_OVERALL', 
                    RangeAvg(
                      Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned Overall]),
                      Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_Last_YearEnd))}>} [Percent Earned Overall]),
                      Max({<[Points Possible Overall] = {">0"}, [Overall Tier] = {"*"}, YearEnd={$(=$(v_LastLast_YearEnd))}>} [Percent Earned Overall])
                    ),
                  If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
                    RangeAvg(
                      Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned in Domain]),
                      Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_Last_YearEnd))}>} [Percent Earned in Domain]),
                      Max({<[Points Possible in Domain] = {">0"}, [Metric ID] = {"Z_ACH_OVERALL", "Z_PROG_OVERALL", "Z_CLIM_OVERALL", "Z_CC_OVERALL"}, YearEnd={$(=$(v_LastLast_YearEnd))}>} [Percent Earned in Domain])
                    ),
                    RangeAvg(
                      Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Percent Earned for Metric]),
                      Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_Last_YearEnd))}>} [Percent Earned for Metric]),
                      Max({<[Points Possible for Metric] = {">0"}, [Tier for Metric] = {"*"}, YearEnd={$(=$(v_LastLast_YearEnd))}>} [Percent Earned for Metric])
                    )
                  )
                )
              , '#0.#%')`
          }
        },
        {
          qDef: {
            qLabel: 'points-earned', 
            qDef: `Num(
              If([Metric ID] = 'Z_OVERALL_OVERALL', Max({<[Exception Overall] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Points Earned Overall]),
                If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
                  Round(Max({<[Points Possible in Domain] = {">0"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Points Earned in Domain]), 0.01),
                  Round(Max({<[Points Possible for Metric] = {">0"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Points Earned for Metric]), 0.01)
                  )) , '#0.##')
              `
          }
        },
        {
          qDef: {
            qLabel: 'points-possible', 
            qDef: `Num(
              If([Metric ID] = 'Z_OVERALL_OVERALL', Max({<[Exception Overall] = {"*"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Points Possible Overall]),
                If(Match([Metric ID],'Z_ACH_OVERALL', 'Z_PROG_OVERALL', 'Z_CLIM_OVERALL', 'Z_CC_OVERALL') > 0, 
                  Round(Max({<[Points Possible in Domain] = {">0"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Points Possible in Domain]), 0.01),
                  Round(Max({<[Points Possible for Metric] = {">0"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Points Possible for Metric]), 0.01)
                )) , '#0.##')`
          }
        },
        // The following are for metric-level only 

        // scores can be % in some cases and # in others
        {
          qDef: {
            qLabel: 'score', 
            qDef: `If(WildMatch([Metric ID], '*_AGI*') > 0,
              Num(Round(Max({<YearEnd={$(=$(v_Max_YearEnd))}>} [Score for Metric]), 0.01), '#0.##'),
              Num(Round(Max({<YearEnd={$(=$(v_Max_YearEnd))}>} [Score for Metric])) / 100, '#0%')              
            )`
          }
        },
        {
          qDef: {
            qLabel: 'denominator', 
            qDef: `Num(Max({<[Denominator for Metric] = {">0"}, YearEnd={$(=$(v_Max_YearEnd))}>} [Denominator for Metric]), '#,##0')`
          }
        },
        // The following are for metric-level and domain-level
        

      ],     
    }
}