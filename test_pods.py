#!/usr/bin/env python3
import subprocess
import time

class PodInteractionTester:
    def __init__(self, namespace="cocode-ns"):
        self.namespace = namespace
        self.pods = self.get_pods()
        self.port_forwards = []

    def get_pods(self):
        """Получить список подов"""
        cmd = f"kubectl get pods -n {self.namespace} -l app=cocode -o jsonpath='{{.items[*].metadata.name}}'"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip().split()

    def start_port_forward(self, pod_name, local_port):
        """Запустить port-forward для пода"""
        cmd = f"kubectl port-forward -n {self.namespace} pod/{pod_name} {local_port}:8080"
        process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        self.port_forwards.append(process)
        time.sleep(2)  # Даем время для запуска
        return process

    def test_concurrent_sessions(self):
        """Тест конкурентного создания сессий"""
        if len(self.pods) < 2:
            print("Need at least 2 pods")
            return

        pod1, pod2 = self.pods[:2]

        # Запускаем port-forward
        print(f"🚀 Starting port-forward for {pod1} on 8081 and {pod2} on 8082...")
        self.start_port_forward(pod1, 8081)
        self.start_port_forward(pod2, 8082)

        time.sleep(3)
        print("Pods successfully started at http://localhost:8081 and http://localhost:8082")

if __name__ == "__main__":
    test = PodInteractionTester()
    test.test_concurrent_sessions()