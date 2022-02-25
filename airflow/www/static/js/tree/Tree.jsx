/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Table,
  Tbody,
  Box,
  Switch,
  FormControl,
  FormLabel,
  Spinner,
  Text,
  Thead,
  Flex,
} from '@chakra-ui/react';

import useTreeData from './useTreeData';
import renderTaskRows from './renderTaskRows';
import DagRuns from './dagRuns';
import SidePanel from './SidePanel';

const Tree = () => {
  const containerRef = useRef();
  const scrollRef = useRef();
  const { data: { groups = {}, dagRuns = [] }, isRefreshOn, onToggleRefresh } = useTreeData();
  const dagRunIds = dagRuns.map((dr) => dr.runId);
  const [selectedInstance, setSelectedInstance] = useState({});

  useEffect(() => {
    // Set initial scroll to far right if it is scrollable
    const runsContainer = scrollRef.current;
    if (runsContainer && runsContainer.scrollWidth > runsContainer.clientWidth) {
      runsContainer.scrollBy(runsContainer.clientWidth, 0);
    }
  }, []);

  const { runId, taskId } = selectedInstance;
  const onSelectInstance = (newInstance) => (
    (newInstance.runId === runId && newInstance.taskId === taskId)
      ? setSelectedInstance({})
      : setSelectedInstance(newInstance)
  );

  return (
    <Box position="relative" ref={containerRef}>
      <FormControl display="flex" alignItems="center" justifyContent="flex-end" width="100%" mb={2}>
        {isRefreshOn && <Spinner color="blue.500" speed="1s" mr="4px" />}
        <FormLabel htmlFor="auto-refresh" mb={0} fontSize="12px" fontWeight="normal">
          Auto-refresh
        </FormLabel>
        <Switch id="auto-refresh" onChange={onToggleRefresh} isChecked={isRefreshOn} size="lg" />
      </FormControl>
      <Text transform="rotate(-90deg)" position="absolute" left="-6px" top="130px">Runs</Text>
      <Text transform="rotate(-90deg)" position="absolute" left="-6px" top="190px">Tasks</Text>
      <Box pl="24px" height="100%" onClick={() => setSelectedInstance({})}>
        <Flex position="relative" flexDirection="row" justifyContent="space-between" overflow="hidden">
          <Box mr="12px" pb="12px" overflowX="auto" ref={scrollRef} maxWidth="60vw">
            <Table height={0}>
              <Thead>
                <DagRuns containerRef={containerRef} selectedInstance={selectedInstance} />
              </Thead>
              <Tbody>
                {renderTaskRows({
                  task: groups, containerRef, onSelectInstance, selectedInstance, dagRunIds,
                })}
              </Tbody>
            </Table>
          </Box>
          <SidePanel instance={selectedInstance} />
        </Flex>
      </Box>
    </Box>
  );
};

export default Tree;
