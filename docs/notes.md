

/                                   -> home.jsx         -> (rename to datasets and load as default)
/datasets/                           ->                             ?  ( use home and fetch list of datasets )

/datasets/AF001EW                    -> dataset/details
/datasets/AF001EW/download           -> dataset/download


datasets/AF001EW/dimensions         -> dataset/dimension            ?   ( move to dimensions component )
datasets/AF001EW/dimensions/D000125 -> dataset/dimension            ?
                                               -> DimensionList -> DimensionItems (hub)
                                               -> DimensionSelector     - loads checkbox screen as default ( ? rename ? )

datasets/AF001EW/dimensions/D000125?action=browse       -> dimension/browse                 ( ? BrowsePage )
datasets/AF001EW/dimensions/D000125?action=search       -> dimension/search                 ( ? SearchPage )
datasets/AF001EW/dimensions/D000125?action=summary      -> dimension/summary                ( ? SummaryPage )
datasets/AF001EW/dimensions/D000125?action=customise    -> dimension/customisation          ( ? HierarchySelector )




----

datasets/AF001EW/dimensions         -> dataset/dimensions
                                            -> DimensionList -> DimensionItems (hub)

datasets/AF001EW/dimensions/D000125 -> dataset/dimension
                                                -> HierarchySelector
                                                        -> Browse          ( ? it sounds like method name )
                                                        -> Search
                                                        -> Summary
                                                        -> SimpleSelector   (? copy paste )
                                                -> TimeSelector
                                                        -> SimpleSelector   (? copy paste )
                                                -> SimpleSelector



DimensionSelector
    -> HierarchySelector
    -> TimeSelector
    -> SimpleSelector


datasets/AF001EW/dimensions     [customise] -> datasets/AF001EW/dimensions/D000125



---


resolve inner dependencies