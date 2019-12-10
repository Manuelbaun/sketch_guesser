|Tests | Yjs (13.0.0-102) | Yjs (13.0.0-98)|Automerge (0.12.1) | Automerge (0.10.1)|
|:-------|:---------|:---------|:---------|:---------|
|Bundle size                                                               |     48969 bytes |     45007 bytes |    258634 bytes |    251368 bytes |
|Bundle size (gzipped)                                                     |     14847 bytes |     13589 bytes |     61163 bytes |     59856 bytes |
|[B1.1] Append N characters (time)                                         |          141 ms |          155 ms |         2198 ms |         3241 ms |
|[B1.1] Append N characters (avgUpdateSize)                                |        20 bytes |        20 bytes |       326 bytes |       326 bytes |
|[B1.1] Append N characters (docSize)                                      |      6018 bytes |      6018 bytes |   2161851 bytes |   2161851 bytes |
|[B1.1] Append N characters (parseTime)                                    |            0 ms |            0 ms |          678 ms |          950 ms |
|[B1.2] Insert string of length N (time)                                   |            1 ms |            4 ms |         2554 ms |         3374 ms |
|[B1.2] Insert string of length N (avgUpdateSize)                          |      6018 bytes |      6018 bytes |   1484719 bytes |   1484719 bytes |
|[B1.2] Insert string of length N (docSize)                                |      6018 bytes |      6018 bytes |   1569051 bytes |   1569051 bytes |
|[B1.2] Insert string of length N (parseTime)                              |            0 ms |            0 ms |          410 ms |          732 ms |
|[B1.3] Prepend N characters (time)                                        |           96 ms |          135 ms |        56507 ms |        98837 ms |
|[B1.3] Prepend N characters (avgUpdateSize)                               |        20 bytes |        20 bytes |       290 bytes |       290 bytes |
|[B1.3] Prepend N characters (docSize)                                     |     59881 bytes |     59881 bytes |   1946994 bytes |   1946994 bytes |
|[B1.3] Prepend N characters (parseTime)                                   |           20 ms |           11 ms |        50107 ms |        96560 ms |
|[B1.4] Insert N characters at random positions (time)                     |          224 ms |          269 ms |         2596 ms |         3974 ms |
|[B1.4] Insert N characters at random positions (avgUpdateSize)            |        27 bytes |        27 bytes |       326 bytes |       326 bytes |
|[B1.4] Insert N characters at random positions (docSize)                  |    100602 bytes |    100602 bytes |   2159192 bytes |   2159192 bytes |
|[B1.4] Insert N characters at random positions (parseTime)                |            5 ms |            8 ms |          804 ms |         1291 ms |
|[B1.5] Insert N words at random positions (time)                          |          319 ms |          433 ms |        11252 ms |        18079 ms |
|[B1.5] Insert N words at random positions (avgUpdateSize)                 |        33 bytes |        33 bytes |      1587 bytes |      1587 bytes |
|[B1.5] Insert N words at random positions (docSize)                       |    204120 bytes |    204120 bytes |  10148335 bytes |  10148335 bytes |
|[B1.5] Insert N words at random positions (parseTime)                     |           13 ms |           23 ms |         3575 ms |         6894 ms |
|[B1.6] Insert string, then delete it (time)                               |            1 ms |            2 ms |         2314 ms |         3071 ms |
|[B1.6] Insert string, then delete it (avgUpdateSize)                      |      6029 bytes |      6029 bytes |   1412719 bytes |   1412719 bytes |
|[B1.6] Insert string, then delete it (docSize)                            |        27 bytes |        27 bytes |   1497051 bytes |   1497051 bytes |
|[B1.6] Insert string, then delete it (parseTime)                          |            0 ms |            0 ms |          247 ms |          369 ms |
|[B1.7] Insert/Delete strings at random positions (time)                   |          264 ms |          380 ms |         6672 ms |        10523 ms |
|[B1.7] Insert/Delete strings at random positions (avgUpdateSize)          |        24 bytes |        24 bytes |      1102 bytes |      1102 bytes |
|[B1.7] Insert/Delete strings at random positions (docSize)                |     91617 bytes |     91617 bytes |   7085598 bytes |   7085598 bytes |
|[B1.7] Insert/Delete strings at random positions (parseTime)              |            5 ms |           15 ms |         2506 ms |         4554 ms |
|[B1.8] Append N numbers (time)                                            |          154 ms |          273 ms |         2880 ms |        25717 ms |
|[B1.8] Append N numbers (avgUpdateSize)                                   |        25 bytes |        25 bytes |       333 bytes |       333 bytes |
|[B1.8] Append N numbers (docSize)                                         |     35623 bytes |     35623 bytes |   2200659 bytes |   2200659 bytes |
|[B1.8] Append N numbers (parseTime)                                       |            0 ms |            0 ms |          759 ms |          900 ms |
|[B1.9] Insert Array of N numbers (time)                                   |            1 ms |            2 ms |         3027 ms |         3516 ms |
|[B1.9] Insert Array of N numbers (avgUpdateSize)                          |     35650 bytes |     35650 bytes |   1523693 bytes |   1523693 bytes |
|[B1.9] Insert Array of N numbers (docSize)                                |     35650 bytes |     35650 bytes |   1608026 bytes |   1608026 bytes |
|[B1.9] Insert Array of N numbers (parseTime)                              |            0 ms |            0 ms |          610 ms |          693 ms |
|[B1.10] Prepend N numbers (time)                                          |           55 ms |          105 ms |        62416 ms |       115338 ms |
|[B1.10] Prepend N numbers (avgUpdateSize)                                 |        25 bytes |        25 bytes |       297 bytes |       297 bytes |
|[B1.10] Prepend N numbers (docSize)                                       |     89511 bytes |     89511 bytes |   1985894 bytes |   1985894 bytes |
|[B1.10] Prepend N numbers (parseTime)                                     |            7 ms |            8 ms |        65674 ms |        87201 ms |
|[B1.11] Insert N numbers at random positions (time)                       |          231 ms |          265 ms |         3307 ms |        23861 ms |
|[B1.11] Insert N numbers at random positions (avgUpdateSize)              |        32 bytes |        32 bytes |       332 bytes |       332 bytes |
|[B1.11] Insert N numbers at random positions (docSize)                    |    130248 bytes |    130248 bytes |   2198120 bytes |   2198120 bytes |
|[B1.11] Insert N numbers at random positions (parseTime)                  |            7 ms |           20 ms |         1026 ms |         1351 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (time)           |            1 ms |            1 ms |         5881 ms |         7442 ms |
|[B2.1] Cuncurrently insert string of length N at index 0 (updateSize)     |     12035 bytes |     12036 bytes |   2970726 bytes |   2970726 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (docSize)        |     12141 bytes |     12142 bytes |   3164619 bytes |   3164619 bytes |
|[B2.1] Cuncurrently insert string of length N at index 0 (parseTime)      |            0 ms |            0 ms |          908 ms |         1759 ms |
|[B2.2] Cuncurrently insert N characters at random positions (time)        |          336 ms |          462 ms |        45711 ms |        76536 ms |
|[B2.2] Cuncurrently insert N characters at random positions (updateSize)  |    200962 bytes |    189800 bytes |   2753229 bytes |   2753229 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (docSize)     |    201860 bytes |    190698 bytes |   2947122 bytes |   2947122 bytes |
|[B2.2] Cuncurrently insert N characters at random positions (parseTime)   |           19 ms |           38 ms |        51081 ms |        89256 ms |
|[B2.3] Cuncurrently insert N words at random positions (time)             |          579 ms |          883 ms |       238044 ms |       381471 ms |
|[B2.3] Cuncurrently insert N words at random positions (updateSize)       |    405775 bytes |    405775 bytes |  17696052 bytes |  17696052 bytes |
|[B2.3] Cuncurrently insert N words at random positions (docSize)          |    406553 bytes |    406553 bytes |  18725017 bytes |  18725017 bytes |
|[B2.3] Cuncurrently insert N words at random positions (parseTime)        |           32 ms |           64 ms |        91350 ms |       174570 ms |
|[B2.4] Cuncurrently insert & delete (time)                                |         1861 ms |         2721 ms |       450791 ms |       613474 ms |
|[B2.4] Cuncurrently insert & delete (updateSize)                          |    620776 bytes |    620776 bytes |  26580311 bytes |  26580311 bytes |
|[B2.4] Cuncurrently insert & delete (docSize)                             |    621449 bytes |    621449 bytes |  28112800 bytes |  28112800 bytes |
|[B2.4] Cuncurrently insert & delete (parseTime)                           |           93 ms |          117 ms |        13450 ms |        21369 ms |
|[B3.1] √N clients concurrently set number in Map (time)                   |            5 ms |           20 ms |           27 ms |           48 ms |
|[B3.1] √N clients concurrently set number in Map (updateSize)             |      1545 bytes |      1548 bytes |     12233 bytes |     12233 bytes |
|[B3.1] √N clients concurrently set number in Map (docSize)                |      1828 bytes |      1834 bytes |     14324 bytes |     14324 bytes |
|[B3.1] √N clients concurrently set number in Map (parseTime)              |            1 ms |            3 ms |           20 ms |           42 ms |
|[B3.2] √N clients concurrently set Object in Map (time)                   |            6 ms |           13 ms |           38 ms |           73 ms |
|[B3.2] √N clients concurrently set Object in Map (updateSize)             |      4515 bytes |      4518 bytes |     34101 bytes |     34101 bytes |
|[B3.2] √N clients concurrently set Object in Map (docSize)                |      2023 bytes |      2025 bytes |     37809 bytes |     37809 bytes |
|[B3.2] √N clients concurrently set Object in Map (parseTime)              |            1 ms |            2 ms |           25 ms |           42 ms |
|[B3.3] √N clients concurrently set String in Map (time)                   |            3 ms |            4 ms |           25 ms |           43 ms |
|[B3.3] √N clients concurrently set String in Map (updateSize)             |     12694 bytes |     12688 bytes |     23331 bytes |     23331 bytes |
|[B3.3] √N clients concurrently set String in Map (docSize)                |      1997 bytes |      1985 bytes |     25422 bytes |     25422 bytes |
|[B3.3] √N clients concurrently set String in Map (parseTime)              |            1 ms |            1 ms |           11 ms |           28 ms |
|[B3.4] √N clients concurrently insert text in Array (time)                |           10 ms |            9 ms |           31 ms |           40 ms |
|[B3.4] √N clients concurrently insert text in Array (updateSize)          |      1681 bytes |      1681 bytes |     24821 bytes |     24821 bytes |
|[B3.4] √N clients concurrently insert text in Array (docSize)             |      1529 bytes |      1529 bytes |     27752 bytes |     27752 bytes |
|[B3.4] √N clients concurrently insert text in Array (parseTime)           |            1 ms |            2 ms |           34 ms |           89 ms |

