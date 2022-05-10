import {
    DisplayProcessor,
    StacktraceOption
  } from 'jasmine-spec-reporter';
  import SuiteInfo = jasmine.SuiteInfo;
  
  class CustomProcessor extends DisplayProcessor {
    public displayJasmineStarted(info: SuiteInfo, log: string): string {
      return `${log}`;
    }
  }
  
  jasmine.getEnv().clearReporters();
  const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
  jasmine.getEnv().addReporter(
    new SpecReporter({
      spec: {
        displayStacktrace: StacktraceOption.NONE
      },
      customProcessors: [CustomProcessor]
    })
  );
  