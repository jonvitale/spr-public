export default {
  qInfo: { qType: 'visualization' },
  qHyperCubeDef: {
    qInitialDataFetch: [
      {
        qWidth: 20,
        qHeight: 400
      }
    ],
    qDimensions: [
      {
        qDef: {
          qFieldLabels: ['nameReport'],
          qFieldDefs: ['School Name (Reporting Category)']
        },
        qNullSuppression: true
      },
      {
        qDef: { qFieldLabels: ['domainName'], qFieldDefs: ['Domain'] },
        qNullSuppression: false
      },
      {
        qDef: { qFieldLabels: ['metricName'], qFieldDefs: ['Metric'] },
        qNullSuppression: false
      },
      {
        qDef: { qFieldLabels: ['domainId'], qFieldDefs: ['Domain ID'] },
        qNullSuppression: false
      },
      {
        qDef: { qFieldLabels: ['metricId'], qFieldDefs: ['Metric ID'] },
        qNullSuppression: false
      }
    ],
    qMeasures: [
      {
        qDef: {
          qLabel: 'perc_earned',
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
          qLabel: 'perc_earned_py',
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
          qLabel: 'perc_earned_ppy',
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
          qLabel: 'perc_earned_3year',
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
          qLabel: 'points_earned',
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
          qLabel: 'points_possible',
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
      }
      // The following are for metric-level and domain-level
    ]
  }
}
